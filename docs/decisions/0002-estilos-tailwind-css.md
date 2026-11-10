# ADR 0002: Arquitectura de Estilos: Tailwind CSS con Tokens Centralizados y Primitivas Headless

- **Estado:** Aceptado (Reemplaza la propuesta inicial de CSS Modules puros)
- **Fecha:** 2026-10-31
- **Decisores:** Arquitecto de Software Senior / Desarrollador Mantenedor

---

## Contexto y Alcance del Problema

BX Boutique cuenta con una identidad visual refinada y formalmente aprobada bajo el concepto **"Calma urbana"**. La estética exige:

- Una paleta cromática suave y cálida: Crema (`#FDFAF4`), Durazno (`#FBE9DF`), Arena (`#D2B9AB`), Terracota (`#BB7869`), Terracota profundo (`#9A5A4C`), Carbón (`#2B2523`) y Oliva (`#6F7D52`).
- Restricciones geométricas estrictas: fotografías de producto con relación de aspecto cuadrada 1:1 y esquinas redondeadas de `18px`, tarjetas contenedoras durazno con radio de `28px`, botones y pastillas de precio en pastilla completa (`border-radius: 9999px`).
- Accesibilidad estricta WCAG 2.2 nivel AA (contraste mínimo 4.5:1, áreas táctiles ≥ 44px, navegación por teclado, focus visible).
- Un único mantenedor proveniente del entorno C# / Java que busca velocidad de desarrollo, facilidad para encontrar documentación y código mantenible sin fricciones.

Inicialmente se evaluó CSS Modules puro, pero tras analizar la necesidad de construir componentes accesibles complejos (como el cajón deslizante del carrito en móviles) y la predominancia del ecosistema de Next.js, se opta por redefinir la estrategia.

---

## Decisión Técnica

1. **Adopción de Tailwind CSS** como motor de estilos principal del proyecto.
2. **Tokens de diseño integrados en Tailwind:** Las variables CSS canónicas de la clienta se conectan directamente a la configuración del tema de Tailwind. Se generan clases utilitarias semánticas:
   - Fondos: `bg-cream`, `bg-peach`, `bg-terracotta-deep`, etc.
   - Textos: `text-ink`, `text-terracotta`, `text-terracotta-deep`, etc.
   - Radios: `rounded-card` (28px), `rounded-img` (18px), `rounded-pill` (9999px).
3. **Regla de oro anti-caos:** **Prohibido el uso de valores hexadecimales o píxeles arbitrarios entre corchetes en el JSX** (ej: prohibido `bg-[#FBE9DF]` o `rounded-[28px]`). Toda clase debe provenir del tema preconfigurado.
4. **Utilidad de combinación de clases (`cn()`):** Uso estándar de `clsx` + `tailwind-merge` en `src/lib/utils.ts` para gestionar clases dinámicas y variantes sin conflictos de especificidad.
5. **Íconos vectoriales:** Adopción de **`lucide-react`** para garantizar íconos consistentes, livianos y optimizados para e-commerce (bolsa de compras, cerrar, menú, flechas, filtros).
6. **Primitivas Headless accesibles (Radix UI):** Uso exclusivo de `@radix-ui/react-dialog` (o primitivas similares sin estilos) para componentes con alta complejidad de accesibilidad (Drawer del carrito móvil, modales).
7. **Rechazo total de librerías de componentes prediseñados:** Descarte absoluto de librerías con estilos cerrados (Material UI, Ant Design, Bootstrap, Chakra) para no inflar el bundle ni deformar la identidad visual.

---

## Justificación Técnica y Comparativa

### ¿Por qué Tailwind CSS en lugar de CSS Modules?

1. **Alineación con el ecosistema de Next.js:** El 90% de los recursos, guías y soluciones de la comunidad están concebidos para Tailwind. Esto ahorra horas de investigación y depuración para el mantenedor.
2. **Velocidad de iteración:** Permite ajustar espaciados responsivos (`p-4 md:p-6 lg:p-8`) directamente en el archivo del componente sin crear ni sincronizar selectores manuales en archivos `.module.css`.
3. **Cero impacto en el bundle final:** El compilador de Tailwind analiza el código y empaqueta en producción un archivo CSS minificado que contiene exclusivamente las clases utilizadas (Purge / Tree-shaking).

### ¿Por qué Primitivas Headless (Radix UI) + `lucide-react`?

- **Accesibilidad sin esfuerzo manual:** Implementar a mano un Drawer accesible requiere gestionar el foco del teclado (Focus Trap), escuchar eventos `Escape`, prevenir el scroll del body y asociar atributos `aria-*`. Radix UI resuelve la lógica de forma invisible mientras Tailwind aporta el 100% del estilo visual.
- **Eliminación de SVGs duplicados:** `lucide-react` evita ensuciar los componentes con decenas de líneas de código XML/SVG copiado a mano.

---

## Consecuencias y Mitigaciones

- **Riesgo:** Pérdida de legibilidad en componentes grandes si se acumulan demasiadas clases en una sola etiqueta.
- **Mitigación:** Extracción modular estricta. Componentes atómicos reutilizables (`<Button />`, `<ProductCard />`, `<PricePill />`) encapsulan sus clases en `src/ui/components/`, manteniendo las páginas y vistas de negocio simples y limpias.
