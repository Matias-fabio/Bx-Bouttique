# Sistema de Diseño y Tokens - BX Boutique

Concepto rector: **"Calma urbana"**. Base cálida, limpia y silenciosa para que las prendas sean las protagonistas. Estructura moderna y deportiva con tipografía firme, grillas aireadas y bordes generosamente redondeados, implementada mediante **Tailwind CSS**.

---

## 1. Tokens de Diseño y Configuración de Tema en Tailwind

Los valores visuales del proyecto se centralizan como variables CSS en `src/styles/globals.css` y se mapean directamente en la configuración de Tailwind. De este modo, los componentes utilizan clases utilitarias semánticas (`bg-peach`, `text-terracotta-deep`, `rounded-card`), quedando terminantemente prohibido usar valores arbitrarios entre corchetes (`bg-[#...]`).

### Definición en CSS (`src/styles/globals.css`)

```css
@import 'tailwindcss';

@layer base {
  :root {
    /* 1. Colores de la Marca (Aprobados por la clienta) */
    --color-cream: #fdfaf4; /* Fondo principal de la tienda */
    --color-peach: #fbe9df; /* Fondos de tarjetas, secciones destacadas, banners */
    --color-sand: #d2b9ab; /* Bordes, líneas divisorias y separadores sutiles */
    --color-terracotta: #bb7869; /* Acentos decorativos y títulos grandes (NO texto chico con blanco) */
    --color-terracotta-deep: #9a5a4c; /* Botones primarios, links, pastilla de precio (Texto blanco: Cumple AA) */
    --color-terracotta-hover: #7f4a3e; /* Estado hover de botones primarios */
    --color-ink: #2b2523; /* Texto principal y títulos (nunca negro puro #000) */
    --color-olive: #6f7d52; /* Etiquetas de estado ("Nuevo", "Últimos disponibles") */
    --color-white: #ffffff; /* Blanco puro para contrastes altos */
    --color-error: #b3261e; /* Mensajes de error en formularios */

    /* 2. Radios de Curvatura Específicos */
    --radius-sm: 8px;
    --radius-md: 14px;
    --radius-img: 18px; /* Radio obligatorio para fotos de productos */
    --radius-card: 28px; /* Radio de las tarjetas contenedoras durazno */
    --radius-pill: 9999px; /* Botones y pastillas completamente redondeadas */
  }
}
```

### Mapeo de Clases Utilitarias en Tailwind

Al configurar el tema, disponemos de clases legibles y semánticas:

- **Fondos:** `bg-cream`, `bg-peach`, `bg-sand`, `bg-terracotta-deep`, `hover:bg-terracotta-hover`.
- **Textos:** `text-ink`, `text-terracotta`, `text-terracotta-deep`, `text-olive`, `text-error`.
- **Bordes:** `border-sand`, `border-ink`, `border-terracotta-deep`.
- **Radios:** `rounded-img` (18px), `rounded-card` (28px), `rounded-pill` (9999px).

---

## 2. Componentes Base y Especificaciones Visuales

Para mantener el JSX limpio y legible, la presentación se encapsula en componentes atómicos dentro de `src/ui/components/`, utilizando la utilidad `cn()` (`clsx` + `tailwind-merge`) y los íconos de `lucide-react`.

### 2.1. Botones (`<Button />`)

- **Estructura:** Botón en pastilla completa (`rounded-pill`).
- **Dimensiones táctiles:** Altura mínima de 44px (`h-11 px-6`).
- **Variantes implementadas con Tailwind:**
  - `primary`: `bg-terracotta-deep text-white hover:bg-terracotta-hover active:scale-[0.98]`
  - `secondary`: `bg-transparent border-1.5 border-ink text-ink hover:bg-peach`
  - `soft`: `bg-peach text-ink hover:bg-sand/40`
- **Accesibilidad:** Anillo visible al navegar por teclado (`focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2`).

### 2.2. Tarjeta de Producto (`<ProductCard />`)

- **Contenedor:** Fondo durazno (`bg-peach`), esquinas de 28px (`rounded-card`), padding interno espacioso (`p-4 sm:p-5`).
- **Fotografía de Prenda:**
  - Contenedor cuadrado estricto con `aspect-square`.
  - Bordes redondeados con `rounded-img` (18px) sobre fondo liso.
  - Imagen con `object-cover` optimizada mediante `next/image`.
- **Pastilla de Precio:** Etiqueta en pastilla con `bg-terracotta-deep text-white font-bold rounded-pill px-3 py-1`, cumpliendo contraste WCAG AA.
- **Acciones:** Ícono de bolsa de compras provisto por `lucide-react` (`<ShoppingBag className="w-5 h-5" />`).

### 2.3. Chips y Filtros (`<Chip />`)

- **Forma:** Pastilla redondeada (`rounded-pill`, altura 36px).
- **Estado Inactivo:** `bg-transparent border border-sand text-ink hover:border-ink`.
- **Estado Activo / Seleccionado:** `bg-peach border-1.5 border-terracotta-deep text-ink font-semibold`.

### 2.4. Formulario e Inputs (`<Input />`, `<Select />`)

- **Estructura:** Label visible superior (`text-sm font-medium text-ink`). Campo de entrada con altura mínima 44px (`h-11 px-4 rounded-md border border-sand bg-cream focus-visible:ring-2 focus-visible:ring-terracotta-deep`).
- **Mensaje de Error:** Texto en `text-error text-xs mt-1` asociado mediante `aria-describedby`.

### 2.5. Drawer / Modal Accesible del Carrito (Radix UI)

- Construido con la primitiva `@radix-ui/react-dialog`.
- **Comportamiento sin fricción:** Al hacer clic en el carrito, se despliega un panel lateral desde la derecha (`translate-x-0 transition-transform`).
- **Accesibilidad automática:** Radix UI bloquea el scroll de fondo, atrapa el foco del teclado (Tab) dentro del carrito y permite cerrarlo presionando la tecla `Escape` o haciendo clic fuera del panel.

### 2.6. Galería de Producto (`<ProductGallery />`)

- Imagen principal cuadrada (`aspect-square rounded-img overflow-hidden`).
- Tira de miniaturas inferiores con bordes interactivos para alternar la foto principal.

### 2.7. Logo Provisorio (`<Logo />`)

- Ubicación: `src/ui/components/Logo/index.tsx`.
- Renderiza el texto tipográfico de marca con tracking ajustado: "Bx Boutique".
- Diseñado para reemplazarse en un único archivo cuando la clienta entregue el isotipo vectorial en SVG.

---

## 3. Accesibilidad (WCAG 2.2 Nivel AA)

1. **Ratios de Contraste Verificados:**
   - `--color-terracotta-deep` (`#9A5A4C`) sobre texto blanco (`#FFFFFF`) alcanza **4.6:1** (supera el 4.5:1 exigido para texto estándar).
   - `--color-terracotta` (`#BB7869`) **no se utiliza con texto chico blanco**, reservándose para títulos mayores a 24px o acentos decorativos.
2. **Navegación por Teclado:** Todo botón, enlace o campo interactivo cuenta con `focus-visible:ring-2 focus-visible:outline-none`.
3. **Áreas Táctiles en Móviles:** Ningún elemento pulsable tiene dimensiones inferiores a 44x44px.
4. **Respeto a Movimiento Reducido:**
   ```css
   @media (prefers-reduced-motion: reduce) {
     *,
     *::before,
     *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

---

## 4. Estrategia de Rendimiento e Imágenes en Vercel

1. **Almacenamiento de Origen:** Las fotos de prendas se alojan en un bucket público de **Supabase Storage**.
2. **Optimización con `next/image`:**
   - Imagen principal de la ficha de producto (LCP): `priority={true}` para descarga inmediata.
   - Grilla del catálogo: `loading="lazy"`.
   - Atributo `sizes` explícito para descargar el tamaño exacto según el viewport móvil o desktop:
     ```tsx
     sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
     ```
3. **Caché y Cuotas en Vercel:** Configuración de formatos automáticos WebP/AVIF y cabeceras inmutables para no agotar la cuota mensual de transformaciones en Vercel.
