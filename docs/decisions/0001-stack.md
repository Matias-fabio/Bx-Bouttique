# ADR 0001: Selección del Stack Tecnológico Principal

- **Estado:** Aceptado
- **Fecha:** 2026-10-30 (Actualizado 2026-10-31 con Tailwind CSS y Primitivas Headless)
- **Decisores:** Arquitecto de Software Senior / Desarrollador Mantenedor

---

## Contexto y Alcance del Problema

BX Boutique requiere una tienda online a medida para comercializar indumentaria urbana y deportiva en Argentina (ARS, `es-AR`). El alcance comprende ~30 productos con variantes de talle y color, carrito y checkout de invitados, cobro mediante Mercado Pago Checkout Pro, cálculo de envíos por zona, emails transaccionales, y un panel de administración privado propio.

El proyecto será mantenido por un único desarrollador con sólida formación en backend estructurado (**TypeScript, C# ASP.NET, Java**), pero con escaso conocimiento previo de los detalles internos de Next.js y el ecosistema JS contemporáneo. Por tanto, la simplicidad conceptual, el tipado estricto, la legibilidad del código y la facilidad de depuración son requisitos de primer orden.

---

## Decisión Técnica

Se congela el siguiente stack tecnológico unificado:

1. **Framework Fullstack:** **Next.js 15 (App Router)** ejecutándose exclusivamente sobre el **runtime de Node.js** (descartando Edge Runtime para base de datos y lógica compleja).
2. **Base de Datos y Persistencia:** **PostgreSQL en Supabase** (región São Paulo, `sa-east-1`, cercana a Buenos Aires). El acceso se realiza exclusivamente desde el servidor mediante el pooler de conexiones **Supavisor** (puerto 6543 en modo transacción, con driver `postgres-js` configurado con `{ prepare: false }`).
3. **Capa de Acceso a Datos (ORM):** **Drizzle ORM** con **drizzle-kit** para migraciones SQL versionadas y deterministas.
4. **Validación en Bordes:** **Zod** para validación de variables de entorno, entradas de Server Actions y payloads de webhooks.
5. **Autenticación:** **Supabase Auth** restringido exclusivamente a administradores, con factor de doble autenticación (**MFA con TOTP**) mandatorio.
6. **Pasarela de Pagos:** **Mercado Pago Checkout Pro** (redirección) combinada con Route Handlers para recepción de webhooks asíncronos y verificación criptográfica.
7. **Comunicaciones:** **Resend** con plantillas tipadas en **React Email**.
8. **Calidad y Pruebas:** **Vitest** (pruebas unitarias y de integración contra Postgres real) y **Playwright** (pruebas E2E de flujos de compra).
9. **Estilos e Interfaz:** **Tailwind CSS** con tokens centralizados, utilidad `cn()` (`clsx` + `tailwind-merge`), íconos vectoriales con **`lucide-react`** y primitivas accesibles sin estilos con **Radix UI** (descartando librerías pesadas tipo MUI/AntD).
10. **Infraestructura:** **Vercel** (región `gru1`, São Paulo, co-localizado con Supabase para latencia mínima de DB < 5ms) protegido perimetralmente por **Cloudflare** (DNS, CDN estático y WAF). Monitoreo de errores con **Sentry** y logs estructurados con **Pino**.

---

## Consecuencias y Análisis de Trade-offs

### Ventajas (Pros)

- **Cero latencia geográfica:** Tanto Vercel (`gru1`) como Supabase (`sa-east-1`) residen en São Paulo, reduciendo la latencia de red entre la app y la base de datos a menos de 5-10 milisegundos, fundamental para transacciones atómicas de stock.
- **Transparencia y depuración simple con Drizzle:** A diferencia de ORMs con capas masivas de abstracción (como Prisma o TypeORM), Drizzle traduce TypeScript directamente a sentencias SQL limpias, similar a Dapper en C# o JDBI en Java.
- **Seguridad en pagos:** La combinación de Checkout Pro con verificación obligatoria de firmas HMAC y consulta directa al endpoint de pagos de Mercado Pago previene ataques de manipulación de precios y fraude.
- **Velocidad de maquetación y accesibilidad con Tailwind + Radix UI:** Facilidad para construir la UI de "Calma urbana" sin reinventar el manejo de modales, focus trapping ni accesibilidad WCAG AA.
- **Mantenibilidad individual:** Un solo lenguaje (TypeScript estricto) para todo el ciclo de vida, con tipado compartido de punta a punta (Database -> Dominio -> UI).

### Desventajas y Trade-offs Asumidos

- **Complejidad del Pooler en Modo Transacción:** El pooler de Supavisor en puerto 6543 no soporta _prepared statements_. Se mitigó configurando explícitamente `prepare: false` en el driver y reservando el puerto 5432 directo únicamente para correr migraciones con `drizzle-kit`.
- **Disciplina en Tailwind:** Requiere evitar clases arbitrarias entre corchetes para no desarmar los tokens de diseño aprobados por la clienta.
- **Next.js App Router y Componentes Asíncronos:** En Next.js 15, `headers()`, `cookies()` y los parámetros de ruta son asíncronos (`Promise`). Se asume esta convención en todo el código con soporte pedagógico continuo.
- **Sin cuentas de usuario para clientes:** Los compradores operan como invitados. Esto reduce la fricción de compra en un 40% según estándares de la industria, aunque traslada la correlación de órdenes al email y al número de pedido.
