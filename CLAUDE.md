# CLAUDE.md - BX Boutique

> Reglas permanentes y guía operativa del proyecto para agentes de IA y desarrolladores.

---

## 1. Contexto del Proyecto

- **Marca:** BX Boutique — Indumentaria urbana y deportiva femenina/unisex (Argentina).
- **Moneda:** Pesos Argentinos (ARS) — Formato estricto: `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })`.
- **Idioma:** Español de Argentina (`es-AR`).
- **Alcance MVP:** ~30 productos con variantes (talle/color), catálogo, ficha de producto, carrito, checkout como invitado, pago con Mercado Pago (Checkout Pro), cálculo de envío por zona + retiro en local, emails transaccionales (confirmación y seguimiento), panel de administración propio (productos, stock, pedidos, edición masiva de precios), SEO básico.
- **Fuera de alcance (NO implementar):** Facturación electrónica ARCA/AFIP, programa de puntos, cupones avanzados, app móvil, cuentas de cliente con login.
- **Mantenedor único:** Desarrollador con fondo en TypeScript, C# ASP.NET y Java. Priorizar código legible, explícito, aburrido y fácil de depurar sobre soluciones mágicas o ingeniosas.

---

## 2. Stack Tecnológico Congelado (Versiones Validadas)

El stack es definitivo. Cualquier cambio requiere justificación técnica formal y aprobación previa.

| Herramienta                | Versión / Target                                  | Equivalente en C# / Java                   | Propósito                                                             |
| -------------------------- | ------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------- |
| **Next.js**                | 15.x (App Router, Node.js runtime)                | ASP.NET Core Razor Pages / Blazor SSR      | Framework web fullstack híbrido (servidor y cliente).                 |
| **TypeScript**             | 5.x (`strict: true`)                              | C# 12 / Java 21                            | Tipado estático en tiempo de compilación. Prohibido `any`.            |
| **Postgres en Supabase**   | PostgreSQL 16 (São Paulo `sa-east-1`)             | SQL Server / PostgreSQL en AWS RDS         | Base de datos relacional transaccional.                               |
| **Driver de DB**           | `postgres` (postgres-js) con `prepare: false`     | Npgsql / JDBC (modo transaction pooling)   | Conexión a través del pooler de Supabase (Supavisor puerto 6543).     |
| **Drizzle ORM + Kit**      | drizzle-orm 0.38+ / drizzle-kit 0.30+             | EF Core / Dapper / Hibernate               | ORM tipado de bajo overhead con migraciones SQL versionadas.          |
| **Zod**                    | 3.24+                                             | FluentValidation / Jakarta Bean Validation | Validación de esquemas y tipos en runtime en todos los bordes.        |
| **Supabase Auth**          | `@supabase/ssr` 0.5+                              | ASP.NET Core Identity con MFA TOTP         | Autenticación exclusiva para administradores (con 2FA obligatorio).   |
| **Mercado Pago SDK**       | `mercadopago` 2.x                                 | Mercado Pago .NET SDK                      | Pasarela de pago en Argentina (Checkout Pro redirección + Webhooks).  |
| **Emails**                 | `resend` 4.x + `@react-email/components`          | SendGrid + Razor Templates                 | Envío de correos transaccionales con plantillas React tipadas.        |
| **Testing Unit/Int**       | Vitest 3.x                                        | xUnit / NUnit / JUnit 5                    | Suite de pruebas unitarias y de integración contra DB Postgres real.  |
| **Testing E2E**            | Playwright 1.50+                                  | Playwright .NET / Selenium                 | Pruebas de extremo a extremo de flujos críticos de compra.            |
| **Estilos**                | Tailwind CSS + `clsx` + `tailwind-merge` (`cn()`) | Clases utilitarias / StringBuilder de CSS  | Estilos atómicos con tokens semánticos vinculados al tema.            |
| **Primitivas UI Headless** | `@radix-ui/react-dialog`                          | Controles desacoplados en WPF/XAML         | Accesibilidad WCAG AA en modales/drawers sin estilos prefabricados.   |
| **Iconografía**            | `lucide-react`                                    | FontAwesome / Material Icons NuGet         | Íconos vectoriales SVG limpios y livianos para e-commerce.            |
| **Tipografía**             | Montserrat vía `next/font/google`                 | Fuentes empaquetadas en assembly           | Self-hosted, cero layout shift (CLS), pesos: 400, 500, 600, 700, 800. |
| **Logging & Errores**      | Pino 9.x + Sentry 9.x (`@sentry/nextjs`)          | Serilog + Sentry .NET SDK                  | Logs estructurados JSON de bajo costo y telemetría de excepciones.    |
| **Infraestructura**        | Vercel (región `gru1` São Paulo) + Cloudflare     | Azure App Service + Cloudflare DNS/WAF     | Hosting serverless pegado a la DB con CDN y WAF de borde.             |

---

## 3. Comandos Principales

_(Nota: Estos scripts se consolidarán al crear el `package.json` en el Corte 0. En Windows PowerShell usar `pnpm.cmd` si `pnpm` no está en PATH)._

```bash
# Desarrollo local
pnpm dev              # Inicia el servidor de desarrollo de Next.js (http://localhost:3000)
pnpm build            # Compilación de producción (typecheck + optimización)
pnpm start            # Inicia el servidor compilado de producción

# Calidad de código
pnpm lint             # Ejecuta ESLint en todo el proyecto
pnpm format:check     # Verifica formato con Prettier
pnpm format           # Aplica formato con Prettier
pnpm typecheck        # Ejecuta tsc --noEmit para verificar tipos

# Testing
pnpm test             # Ejecuta tests con Vitest
pnpm test:watch       # Ejecuta Vitest en modo observador
pnpm test:e2e         # Ejecuta Playwright para tests E2E

# Base de datos (Drizzle)
pnpm db:generate      # Genera archivos SQL de migración basados en el schema TS
pnpm db:migrate       # Ejecuta migraciones pendientes contra la DB directa (puerto 5432)
pnpm db:studio        # Abre la UI web de Drizzle para inspeccionar datos locales
```

---

## 4. Estructura de Carpetas (Monolito Modular)

El código se organiza estrictamente por módulos de dominio. Queda prohibida la arquitectura en capas cruzadas donde todos los controladores van juntos o todos los repositorios van juntos.

```text
bx-boutique/
├── CLAUDE.md                       # Reglas del proyecto (este archivo)
├── docs/                           # Documentación técnica y decisiones de diseño
│   ├── ARCHITECTURE.md             # Diagramas, dependencias y flujos
│   ├── DATABASE.md                 # Schema Drizzle, diagramas ER y constraints
│   ├── SECURITY.md                 # Modelo de amenazas y mitigaciones
│   ├── DESIGN-SYSTEM.md            # Tokens en Tailwind, escala tipográfica y componentes base
│   ├── ROADMAP.md                  # Cortes verticales y entregables
│   ├── OPEN-QUESTIONS.md           # Preguntas abiertas para la clienta
│   ├── GLOSSARY.md                 # Conceptos JS explicados para devs C#/Java
│   └── decisions/                  # Architecture Decision Records (ADRs)
│       ├── 0001-stack.md
│       └── 0002-estilos-tailwind-css.md
├── src/
│   ├── app/                        # Next.js App Router (Páginas, Layouts y Route Handlers)
│   │   ├── (shop)/                 # Grupo de rutas públicas (catálogo, producto, carrito, checkout)
│   │   ├── admin/                  # Grupo de rutas privadas del panel de administración
│   │   ├── api/                    # Route Handlers exclusivos (ej: /api/webhooks/mercadopago)
│   │   ├── layout.tsx              # Root Layout (fuente Montserrat, metadata base)
│   │   └── error.tsx               # Boundaries de error
│   ├── modules/                    # MÓDULOS DE NEGOCIO (Monolito modular)
│   │   ├── catalog/                # Productos, variantes, categorías
│   │   ├── inventory/              # Stock, reservas con expiración, ledger de movimientos
│   │   ├── cart/                   # Lógica de carrito del invitado y cálculo de ítems
│   │   ├── shipping/               # Zonas de envío (CABA, GBA, Resto) y retiro en local
│   │   ├── checkout/               # Orquestación de compra y cálculo final en servidor
│   │   ├── payments/               # Adaptador de Mercado Pago, webhooks y verificación
│   │   ├── orders/                 # Pedidos, máquina de estados y snapshots históricos
│   │   ├── notifications/          # Envío de emails con Resend y React Email
│   │   └── admin/                  # Lógica del panel de control (métricas, precios masivos)
│   │       ├── domain/             # Entidades puras, Value Objects, lógica libre de framework
│   │       ├── application/        # Casos de uso (orquestadores de negocio)
│   │       ├── infrastructure/     # Repositorios Drizzle, clientes externos (MP, Resend)
│   │       └── contracts.ts        # ÚNICA API pública exportada hacia otros módulos
│   ├── ui/                         # Componentes de presentación visual (React puro)
│   │   ├── components/             # Botones, Chips, Cards, Inputs, Modales, Galería
│   │   └── layout/                 # Header, Footer, Navegación móvil, Banner
│   ├── styles/                     # Estilos globales y tokens
│   │   └── globals.css             # Importación de Tailwind y definición de variables base
│   └── lib/                        # Infraestructura transversal
│       ├── db/                     # Instancia de Drizzle y pooler de conexión
│       ├── env/                    # Validación de variables de entorno con Zod
│       ├── logger/                 # Logger estructurado Pino
│       ├── utils.ts                # Función helper cn() (clsx + tailwind-merge)
│       └── result/                 # Tipo Result<T, E> para manejo de errores sin excepciones
```

---

## 5. Reglas de Arquitectura y Dependencias entre Módulos

1. **Regla de oro modular:** Un módulo **NUNCA** puede importar directamente archivos internos de otro módulo (ej.: `from '@/modules/inventory/infrastructure/...'` está estrictamente prohibido). Toda comunicación entre módulos debe ocurrir a través de `@/modules/<modulo>/contracts.ts`.
2. **Sin acceso cruzado a bases de datos:** El módulo `orders` no puede ejecutar queries sobre las tablas de `catalog` ni `inventory`. Solicita la información o mutación mediante el caso de uso expuesto en el contrato.
3. **Estructura interna de cada módulo:**
   - `domain/`: TypeScript puro. Cero imports de Next.js, React o Drizzle. Contiene tipos, entidades y validaciones de invariantes.
   - `application/`: Casos de uso específicos (ej: `ProcessPaymentWebhookUseCase`, `CreateOrderUseCase`).
   - `infrastructure/`: Implementaciones concretas de repositorios contra PostgreSQL con Drizzle y clientes de API externas.
   - `contracts.ts`: Exporta los tipos públicos y las funciones de caso de uso autorizadas para consumo externo.
4. **Capa Web Delgada (Thin Controllers):** Las Server Actions y Route Handlers (`src/app/`) son delgadas:
   `Recibir request -> Parsear con Zod -> Invocar Caso de Uso -> Responder / Redirigir`.
   **Prohibido poner lógica de negocio o queries SQL en componentes de UI o Server Actions.**

---

## 6. Reglas No Negociables

1. **Dinero:** Siempre números enteros representando centavos (ej.: `$1.250,50` = `125050`). Usar el Value Object `Money`. Prohibido el uso de flotantes (`number` con decimales) en precios.
2. **Precios en el servidor:** El cliente únicamente envía `{ variantId, quantity }`. El servidor consulta el precio oficial vigente en la DB y recalcula los totales. Jamás se acepta un precio proveniente del cliente.
3. **Stock atómico:** Las deducciones se hacen dentro de una transacción en PostgreSQL con cláusula de guarda:
   `UPDATE inventory SET quantity = quantity - $qty WHERE variant_id = $id AND quantity >= $qty RETURNING quantity;`.
   Cada movimiento de stock debe registrarse en la tabla de auditoría `stock_movements`.
4. **Seguridad en Pagos (Mercado Pago):**
   - Validar la firma HMAC-SHA256 del webhook en la cabecera `x-signature`.
   - **No confiar en el body del webhook:** Una vez recibido el ID de pago, llamar a la API de Mercado Pago (`GET /v1/payments/{id}`) para validar el estado real.
   - Procesamiento estrictamente idempotente apoyado en la tabla `webhook_events` con constraint `UNIQUE(provider_payment_id)`.
5. **Snapshots en Pedidos:** La tabla `order_items` debe guardar una copia estática e inmutable (nombre de producto, SKU, precio unitario pagado, talle, color) al momento de la compra. Si el producto sube de precio o se borra, la orden histórica no cambia.
6. **Máquina de Estados de Pedidos:** Los estados del pedido (`pending_payment`, `paid`, `preparing`, `shipped`, `delivered`, `cancelled`) se gobiernan por transiciones explícitas en el dominio. Una transición inválida rechaza la operación.
7. **Errores Tipados (Result Pattern):** No usar `throw new Error(...)` en la lógica de negocio. Retornar tipos `Result<T, DomainError>` para obligar a quien llama a manejar explícitamente el caso de éxito o de fallo.
8. **Validación de Entorno al Iniciar:** Todas las variables de entorno (`DATABASE_URL`, `MP_ACCESS_TOKEN`, `RESEND_API_KEY`, etc.) se validan mediante Zod en `src/lib/env/index.ts` al arrancar el proceso. Si falta una variable requerida, la app falla inmediatamente (Fail Fast).
9. **Row Level Security (RLS):** RLS activo en todas las tablas de Supabase. El acceso de la app web se realiza con credenciales de servidor (Service Role / direct connection pooling), las cuales jamás deben llegar al cliente.
10. **Funciones concisas y legibles:** Nombres de variables y funciones en inglés descriptivo; comentarios y documentación en español explicando el **POR QUÉ** de la decisión.
11. **Tipado Estricto:** Prohibido `any`. Prohibido `@ts-ignore` salvo caso de fuerza mayor justificado con comentario técnico.
12. **Cada decisión importante se registra como ADR corto** en `docs/decisions/`.
13. **Tokens de Diseño en Tailwind:** Prohibido escribir clases con valores arbitrarios entre corchetes (ej: prohibido `bg-[#FBE9DF]` o `rounded-[28px]`). Se debe utilizar estrictamente el tema configurado (`bg-peach`, `rounded-card`, `text-terracotta-deep`, etc.) para preservar la identidad de la marca.

---

## 7. Reglas Específicas de Next.js (App Router)

- **Server Components por defecto:** Todo componente de React se ejecuta en el servidor a menos que requiera interactividad inmediata del usuario (ej.: selector de talle, drawer del carrito, menú móvil), en cuyo caso se marca en la primera línea con `'use client'`.
- **Protección `server-only`:** Todo archivo que acceda a la base de datos, ejecute lógica de negocio o lea variables secretas debe incluir `import 'server-only'` al inicio. Esto evita que código o secretos se filtren al bundle del navegador.
- **Mutaciones vía Server Actions:** Se invocan como funciones asíncronas con validación Zod en el primer renglón.
- **Route Handlers solo para Webhooks:** Usar `src/app/api/.../route.ts` únicamente para recibir webhooks de Mercado Pago o endpoints que requieran responder JSON a terceros.
- **Caché explícito:** En cada consulta de datos, documentar explícitamente la estrategia de caché mediante comentarios:
  - Estática (`force-static`): Datos que rara vez cambian (categorías base).
  - Revalidada (`next: { revalidate: X }`): Catálogo general (revalidación periódica o por tag).
  - Dinámica (`no-store` o dinámica por defecto en Server Actions): Stock, precios y checkout siempre en tiempo real.

---

## 8. Flujo de Trabajo por Cortes Verticales

El desarrollo se realiza en fases incrementales (Cortes Verticales). En cada corte:

1. **Planificación:** Presentar el plan breve del corte y esperar aprobación.
2. **Tests First:** Escribir tests unitarios para las reglas de dinero, stock o pagos antes de codificar la solución.
3. **Implementación Mínima:** Construir únicamente el código necesario para satisfacer el corte, cumpliendo las reglas de arquitectura.
4. **Verificación:** Ejecutar `typecheck`, `lint` y `test` mostrando la salida limpia.
5. **Entrega Pedagógica:**
   - Diagrama Mermaid del flujo implementado.
   - Lista ordenada de 5 a 8 archivos que el mantenedor debe leer para entender el corte.
   - Sección **"Si esto falla"**: Dónde buscar, qué logs mirar y qué test ayuda a aislar el bug.
   - Mensaje de commit sugerido (formato Conventional Commits).
6. **Espera:** No avanzar al siguiente corte sin confirmación expresa del usuario.

---

## 9. Qué NO Hacer (Anti-Patrones Prohibidos)

- ❌ **NO usar librerías de UI pesadas ni preestiladas** (MUI, Chakra UI, Ant Design, Bootstrap). Usar Tailwind con los tokens y primitivas sin estilos (Radix).
- ❌ **NO usar valores arbitrarios entre corchetes en Tailwind** (ej: `bg-[#...]` o `p-[13px]`). Todo debe provenir de los tokens del tema.
- ❌ **NO calcular precios ni totales en el cliente.**
- ❌ **NO usar números de punto flotante para dinero.**
- ❌ **NO confiar en el payload de los webhooks de Mercado Pago.**
- ❌ **NO escribir queries SQL o lógica de negocio dentro de Server Actions o componentes React.**
- ❌ **NO importar archivos internos de un módulo desde otro módulo.**
- ❌ **NO usar Edge Runtime para la base de datos.** Todo corre en Node.js runtime para compatibilidad total con el pooler y librerías criptográficas.
- ❌ **NO inventar abstracciones complejas prematuras** (CQRS, Event Sourcing, microservicios, repositorios genéricos `IRepository<T>`).
