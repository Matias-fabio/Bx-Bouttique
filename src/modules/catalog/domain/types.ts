
export interface Category {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  variantId: string | null;
  url: string;
  altText: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  priceInCents: number;
  compareAtPriceInCents: number | null;
  isActive: boolean;
}

export interface ProductDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  isActive: boolean;
  category: Category;
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface CatalogItem {
  id: string;
  slug: string;
  title: string;
  categoryName: string;
  categorySlug: string;
  primaryImageUrl: string;
  primaryImageAlt: string;
  minPriceInCents: number;
  maxPriceInCents: number;
  compareAtPriceInCents: number | null;
  availableSizes: string[];
  availableColors: string[];
  hasDiscount: boolean;
}

// ---------------------------------------------------------------------------
// Funciones puras de dominio para variantes y disponibilidad
// ---------------------------------------------------------------------------

/**
 * Busca la variante activa que coincide exactamente con talle y color.
 */
export function findMatchingVariant(
  variants: ProductVariant[],
  size: string,
  color: string
): ProductVariant | undefined {
  return variants.find(
    (v) => v.isActive && v.size.toLowerCase() === size.toLowerCase() && v.color.toLowerCase() === color.toLowerCase()
  );
}

/**
 * Obtiene los talles disponibles para un color seleccionado.
 */
export function getAvailableSizesForColor(
  variants: ProductVariant[],
  selectedColor: string
): string[] {
  const matching = variants.filter(
    (v) => v.isActive && v.color.toLowerCase() === selectedColor.toLowerCase()
  );
  return Array.from(new Set(matching.map((v) => v.size)));
}

/**
 * Obtiene los colores disponibles para un talle seleccionado.
 */
export function getAvailableColorsForSize(
  variants: ProductVariant[],
  selectedSize: string
): string[] {
  const matching = variants.filter(
    (v) => v.isActive && v.size.toLowerCase() === selectedSize.toLowerCase()
  );
  return Array.from(new Set(matching.map((v) => v.color)));
}

/**
 * Verifica si una combinación de talle y color existe y está activa.
 */
export function isCombinationAvailable(
  variants: ProductVariant[],
  size: string,
  color: string
): boolean {
  return variants.some(
    (v) => v.isActive && v.size.toLowerCase() === size.toLowerCase() && v.color.toLowerCase() === color.toLowerCase()
  );
}

/**
 * Calcula el resumen de catálogo (precios, rangos, imágenes) a partir de un producto y sus relaciones.
 */
export function buildCatalogItem(
  product: {
    id: string;
    slug: string;
    title: string;
    category: Category;
    variants: ProductVariant[];
    images: ProductImage[];
  }
): CatalogItem {
  const activeVariants = product.variants.filter((v) => v.isActive);

  const prices = activeVariants.map((v) => v.priceInCents);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const comparePrices = activeVariants
    .map((v) => v.compareAtPriceInCents)
    .filter((p): p is number => typeof p === 'number' && p > 0);
  const compareAtPrice = comparePrices.length > 0 ? Math.max(...comparePrices) : null;

  const sortedImages = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const primary = sortedImages[0];

  const uniqueSizes = Array.from(new Set(activeVariants.map((v) => v.size)));
  const uniqueColors = Array.from(new Set(activeVariants.map((v) => v.color)));

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    primaryImageUrl: primary?.url ?? '/images/placeholder.svg',
    primaryImageAlt: primary?.altText ?? product.title,
    minPriceInCents: minPrice,
    maxPriceInCents: maxPrice,
    compareAtPriceInCents: compareAtPrice && compareAtPrice > minPrice ? compareAtPrice : null,
    availableSizes: uniqueSizes,
    availableColors: uniqueColors,
    hasDiscount: Boolean(compareAtPrice && compareAtPrice > minPrice),
  };
}
