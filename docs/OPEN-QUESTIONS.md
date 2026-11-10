# Preguntas Abiertas y Decisiones de Negocio - BX Boutique

Este documento reúne las definiciones comerciales y legales que debés consensuar con la clienta (dueña de la marca), acompañadas por la recomendación técnica y arquitectónica fundamentada para cada una.

---

## 1. Estrategia de Reserva de Stock durante el Checkout

- **El Dilema:** Cuando un cliente hace clic en "Pagar" y es redirigido a Mercado Pago Checkout Pro, puede tardar hasta varios minutos en ingresar su tarjeta o incluso abandonar la pasarela.
- **Opciones:**
  - **Opción A (Reserva con TTL de 30 minutos):** Al crear la preferencia de pago, se bloquea el stock temporalmente. Si a los 30 minutos no se acreditó el pago, la reserva expira y la prenda vuelve al catálogo.
  - **Opción B (Deducción optimista en Webhook + Reembolso):** No se bloquea el stock preventivamente. El stock se descuenta en el momento exacto en que Mercado Pago notifica el cobro (`approved`). Si dos personas pagaron al mismo tiempo la última prenda, el sistema devuelve automáticamente el dinero al segundo comprador mediante la API de reembolsos de Mercado Pago.
- **Recomendación del Arquitecto:** **Elegir Opción A con TTL de 30 minutos.**
  - _Por qué:_ En indumentaria de diseño con stock acotado (~1 a 3 unidades por talle), no hay peor experiencia de compra para un cliente que haber pagado, recibir el débito en la tarjeta y que a los 5 minutos le digan que no hay stock y le reintegran la plata. La Opción A previene el 99.9% de estas fricciones. La Opción B solo se activa como salvaguarda extrema si un pago entra fuera de término.

---

## 2. Configuración de Zonas de Envío y Retiro en Local

- **El Dilema:** Definir cómo se calculan las tarifas de logística en el territorio argentino para el MVP.
- **Preguntas para la clienta:**
  1. ¿Qué costo fijo asignará a CABA, GBA (primer/segundo cordón) y Resto del País?
  2. ¿Habrá un umbral de envío gratuito (ej: "Envío gratis superando los $80.000")?
  3. ¿Cuál es la dirección exacta y los días/horarios de atención del local físico para el retiro de pedidos?
- **Recomendación del Arquitecto:**
  - Mantener 3 zonas planas simples basadas en rangos de código postal (CP) de 4 dígitos (nativos de Correo Argentino):
    - **Zona 1 (CABA - CP 1000 a 1499):** Tarifa plana de motomensajería (ej: $4.500) — Entrega en 24-48 hs.
    - **Zona 2 (GBA - CP 1500 a 1999):** Tarifa plana estándar (ej: $7.500) — Entrega en 48-72 hs.
    - **Zona 3 (Interior del país - Resto de CPs):** Tarifa plana encomienda (ej: $11.000) — Entrega en 3 a 6 días hábiles.
    - **Retiro en Tienda:** Costo $0, disponible a partir de las 24 hs hábiles de acreditado el pago.
  - _Por qué:_ Integrar APIs de cotización en vivo (como Andreani u OCA) en el MVP añade complejidad innecesaria, costos de API y lentitud al checkout. Las tarifas planas por zona son la norma en boutiques independientes y aceleran la conversión.

---

## 3. Facturación Electrónica ARCA (Ex-AFIP)

- **El Dilema:** La facturación electrónica directa con web services de ARCA (WSAA y WSFE) quedó explícitamente fuera del alcance del MVP por su alta complejidad fiscal y de certificados.
- **Pregunta para la clienta:** ¿Desea que el formulario de checkout solicite el número de CUIT/CUIL y Condición de IVA (Consumidor Final, Monotributo, Responsable Inscripto) a todos los compradores?
- **Recomendación del Arquitecto:** **Sí, solicitar CUIT/CUIL (opcional si es menor a cierto monto, o requerido) y condición fiscal.**
  - _Por qué:_ Aunque el sistema no emita el comprobante fiscal en tiempo real, guardar estos datos en la orden le permite a la dueña o a su contador exportar las ventas a un Excel y emitir las Facturas B/A manualmente desde la web de ARCA en pocos minutos, sin tener que perseguir a cada cliente por WhatsApp.

---

## 4. Políticas de Cambios, Devoluciones y Costos Logísticos

- **El Dilema:** En indumentaria femenina y deportiva, la tasa de cambio por talle oscila entre el 10% y el 20%.
- **Preguntas para la clienta:**
  1. ¿Cuál es el plazo máximo para solicitar cambio de prenda (ej: 30 días corridos desde la recepción)?
  2. ¿Quién abona el costo del envío del cambio? (Habitual: el primer cambio corre por cuenta de la marca, o el cliente paga el flete de ida y la marca el de vuelta).
- **Recomendación del Arquitecto:**
  - Redactar una política simple y visible en el checkout: _"Tenés hasta 30 días para cambiar tu prenda en nuestro local sin cargo, o por correo postal coordinando por WhatsApp"_.
  - Esto reduce las disputas en Mercado Pago y genera confianza en la compra inicial.

---

## 5. Botón de Arrepentimiento (Exigencia Legal en Argentina)

- **El Requisito:** La **Resolución 424/2020 de la Secretaría de Comercio Interior** de la República Argentina establece que todo sitio de comercio electrónico debe incluir un **"Botón de Arrepentimiento"** en un lugar visible de la página principal, mediante el cual el consumidor puede revocar la aceptación del producto dentro de los 10 días corridos de recibido.
- **Recomendación del Arquitecto:**
  - Incluir un enlace directo e inequívoco en el footer (`/arrepentimiento`) que abra un formulario minimalista: `Número de Pedido`, `Email` y `Motivo (opcional)`.
  - Al enviarlo, el sistema marca el pedido con una solicitud de revocación y dispara un email automático tanto al cliente con su número de trámite como a la dueña para iniciar el proceso de retiro y reintegro. Esto evita multas de Defensa del Consumidor.

---

## 6. Información Fiscal y Legal Obligatoria en el Footer

- **El Requisito:** Para operar legalmente en Argentina, el pie de página de la tienda debe exponer información identificatoria clara:
  1. Nombre o Razón Social del titular.
  2. Número de CUIT.
  3. Domicilio legal o comercial.
  4. Código QR del **Formulario 960/D - Data Fiscal de ARCA/AFIP** que vincula al estado tributario del comercio.
- **Recomendación del Arquitecto:**
  - Diseñar el componente `<Footer />` reservando el espacio inferior para estos 4 campos y el enlace a Defensa del Consumidor (Ley 24.240), los cuales se parametrizarán mediante variables o archivo de configuración de la tienda.
