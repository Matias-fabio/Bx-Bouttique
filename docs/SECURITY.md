# Modelo de Amenazas y Seguridad - BX Boutique

Este documento analiza los vectores de ataque más comunes en una tienda de comercio electrónico en producción y detalla las contramedidas arquitectónicas implementadas en BX Boutique.

> **Nota Pedagógica para desarrolladores C# / Java:**
> En Next.js App Router, una **Server Action** funciona como un método `[HttpPost]` en un Controller de ASP.NET Core o Spring MVC, pero sin necesidad de declarar rutas manuales. Como cualquier endpoint público HTTP, **nunca debe asumir que los datos recibidos son legítimos**. Tratá a cada Server Action como un endpoint público que cualquier persona puede invocar con `curl` o Postman.

---

## 1. Matriz de Vectores de Amenaza y Mitigaciones

| #     | Vector de Ataque                                           | Escenario de Explotación                                                                                                         | Mitigación Arquitectónica en BX Boutique                                                                                                                                                                                                                                                                                                    |
| ----- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | **Alteración de Precios (Price Tampering)**                | El usuario intercepta el request de checkout con DevTools y envía un total de `$1` en lugar de `$50.000`.                        | **Cálculo de precios 100% en el servidor.** El cliente solo envía `{ variantId, quantity }`. El servidor consulta la tabla `product_variants`, suma los montos y crea la preferencia de Mercado Pago con los valores de la DB. Jamás se acepta un precio enviado por el navegador.                                                          |
| **2** | **Sobreventa por Carrera (Race Condition)**                | Dos usuarios compran la última unidad de un buzo al mismo milisegundo; la tienda cobra a ambos pero solo puede entregar uno.     | **Actualización atómica en PostgreSQL con bloqueo condicional:** `UPDATE inventory SET quantity = quantity - $qty WHERE variant_id = $id AND quantity >= $qty RETURNING quantity;`. Si filas afectadas = 0, se rechaza la compra.                                                                                                           |
| **3** | **Falsificación de Webhook (Webhook Spoofing)**            | Un atacante envía un POST falso a `/api/webhooks/mercadopago` simulando que su orden fue pagada para que se la despachen.        | **1. Validación criptográfica:** Se verifica la firma HMAC-SHA256 del header `x-signature` con el secreto de webhook.<br/>**2. Consulta obligatoria a la API oficial:** No se confía en el body recibido. Se realiza un `GET https://api.mercadopago.com/v1/payments/{id}` con el token secreto del servidor para consultar el estado real. |
| **4** | **Ataque de Repetición (Replay Attack)**                   | Un atacante reenvía una notificación de pago válida anterior para reactivar o alterar pedidos.                                   | **Tabla de idempotencia `webhook_events`** y restricción `UNIQUE (provider_payment_id)` en la tabla `payments`. Si el ID de pago ya fue procesado, se descarta inmediatamente.                                                                                                                                                              |
| **5** | **Toma de Control de Administración (Account Takeover)**   | Ataque de fuerza bruta o robo de contraseña contra el login del panel de administración (`/admin`).                              | **1. Supabase Auth con MFA (TOTP) obligatorio** para todos los administradores.<br/>**2. Rate limiting nativo** de intentos fallidos provisto por Supabase.<br/>**3. Sin registro público:** El endpoint de signup está deshabilitado; los admins se crean manualmente desde la consola.                                                    |
| **6** | **Fuga de Credenciales Privilegiadas (Service Role Leak)** | La clave con permisos de superadministrador de Supabase se incluye por error en el bundle de JavaScript que descarga el cliente. | **1. Uso del paquete `server-only`:** Se importa en todos los archivos de base de datos e infraestructura. Si un componente de cliente intenta importarlo, la compilación de Next.js falla.<br/>**2. Prefijos de entorno:** Las credenciales secretas no llevan el prefijo `NEXT_PUBLIC_`, por lo que Next.js no las expone al navegador.   |
| **7** | **Inyección y Asignación Masiva (Mass Assignment)**        | Un usuario envía campos adicionales en un formulario (ej: `isAdmin: true` o `status: 'paid'`).                                   | **Validación estricta con Zod en el borde:** Cada Server Action y Route Handler pasa los datos por un esquema `.strict()`, descartando o rechazando cualquier propiedad no declarada explícitamente.                                                                                                                                        |
| **8** | **Denegación de Servicio (DoS) y Spam de Preferencias**    | Un bot genera miles de carritos y llamadas a Mercado Pago para agotar cuotas de API o bloquear stock.                            | **Reglas de Cloudflare WAF** en el borde (Rate limiting por IP, Managed Challenge para tráfico sospechoso) + TTL corto en reservas de stock no confirmadas.                                                                                                                                                                                 |

---

## 2. Implementación de Verificación de Webhooks (Mercado Pago)

El route handler de webhooks implementa la verificación criptográfica oficial recomendada por Mercado Pago:

```typescript
import 'server-only';
import crypto from 'node:crypto';

interface VerifySignatureParams {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string;
  secret: string;
}

/**
 * Valida la autenticidad del webhook de Mercado Pago mediante HMAC-SHA256.
 * Equivalente en C# a HMACSHA256.ComputeHash() validando la cabecera X-Signature.
 */
export function verifyMercadoPagoSignature({
  xSignature,
  xRequestId,
  dataId,
  secret,
}: VerifySignatureParams): boolean {
  if (!xSignature || !xRequestId) return false;

  // Extrae ts (timestamp) y v1 (hash) de la cabecera x-signature: "ts=...,v1=..."
  const parts = xSignature.split(',');
  const tsPart = parts.find((p) => p.trim().startsWith('ts='));
  const hashPart = parts.find((p) => p.trim().startsWith('v1='));

  if (!tsPart || !hashPart) return false;

  const ts = tsPart.split('=')[1];
  const receivedHash = hashPart.split('=')[1];

  // Construye el template canónico de Mercado Pago
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  const calculatedHash = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex');

  // Comparación en tiempo constante para mitigar ataques de tiempo (Timing Attacks)
  return crypto.timingSafeEqual(
    Buffer.from(receivedHash, 'hex'),
    Buffer.from(calculatedHash, 'hex')
  );
}
```

---

## 3. Política de Variables de Entorno y Secretos

Para evitar incidentes de seguridad:

- Ningún secreto (`SUPABASE_SERVICE_ROLE_KEY`, `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `RESEND_API_KEY`) puede comenzar con `NEXT_PUBLIC_`.
- El archivo `.env.example` se mantiene actualizado en el repositorio con nombres de variables y descripciones, pero sin valores reales.
- Las variables de entorno se validan obligatoriamente con Zod en `src/lib/env/index.ts` al inicializar la app. Si falta un secreto, la aplicación lanza un error fatal en el arranque y no atiende peticiones en un estado inseguro.
