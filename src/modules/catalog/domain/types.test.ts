import { describe, it, expect } from 'vitest';
import {
  findMatchingVariant,
  getAvailableSizesForColor,
  getAvailableColorsForSize,
  isCombinationAvailable,
  buildCatalogItem,
  type ProductVariant,
  type ProductImage,
  type Category,
} from './types';

const mockCategory: Category = {
  id: 'cat-1',
  slug: 'remeras',
  name: 'Remeras',
  sortOrder: 1,
  isActive: true,
};

const mockVariants: ProductVariant[] = [
  {
    id: 'var-1',
    productId: 'prod-1',
    sku: 'REM-NEG-S',
    size: 'S',
    color: 'Negro',
    priceInCents: 2500000,
    compareAtPriceInCents: 3000000,
    isActive: true,
  },
  {
    id: 'var-2',
    productId: 'prod-1',
    sku: 'REM-NEG-M',
    size: 'M',
    color: 'Negro',
    priceInCents: 2500000,
    compareAtPriceInCents: null,
    isActive: true,
  },
  {
    id: 'var-3',
    productId: 'prod-1',
    sku: 'REM-BLA-M',
    size: 'M',
    color: 'Blanco',
    priceInCents: 2700000,
    compareAtPriceInCents: null,
    isActive: true,
  },
  {
    id: 'var-4',
    productId: 'prod-1',
    sku: 'REM-BLA-L',
    size: 'L',
    color: 'Blanco',
    priceInCents: 2700000,
    compareAtPriceInCents: null,
    isActive: false, // inactiva / sin stock
  },
];

const mockImages: ProductImage[] = [
  {
    id: 'img-2',
    productId: 'prod-1',
    variantId: null,
    url: 'https://images.unsplash.com/photo-2',
    altText: 'Foto secundaria',
    sortOrder: 2,
  },
  {
    id: 'img-1',
    productId: 'prod-1',
    variantId: null,
    url: 'https://images.unsplash.com/photo-1',
    altText: 'Foto principal',
    sortOrder: 1,
  },
];

describe('Catalog Domain Logic', () => {
  describe('findMatchingVariant', () => {
    it('encuentra la variante activa exacta por talle y color ignorando mayúsculas', () => {
      const variant = findMatchingVariant(mockVariants, 's', 'negro');
      expect(variant).toBeDefined();
      expect(variant?.sku).toBe('REM-NEG-S');
    });

    it('no retorna variantes inactivas', () => {
      const variant = findMatchingVariant(mockVariants, 'L', 'Blanco');
      expect(variant).toBeUndefined();
    });

    it('retorna undefined si la combinación no existe', () => {
      const variant = findMatchingVariant(mockVariants, 'XL', 'Rojo');
      expect(variant).toBeUndefined();
    });
  });

  describe('getAvailableSizesForColor', () => {
    it('retorna solo los talles activos para el color especificado', () => {
      const sizes = getAvailableSizesForColor(mockVariants, 'Negro');
      expect(sizes).toEqual(['S', 'M']);
    });

    it('excluye talles de variantes inactivas', () => {
      const sizes = getAvailableSizesForColor(mockVariants, 'Blanco');
      expect(sizes).toEqual(['M']); // L está inactiva
    });
  });

  describe('getAvailableColorsForSize', () => {
    it('retorna los colores activos para un talle especificado', () => {
      const colors = getAvailableColorsForSize(mockVariants, 'M');
      expect(colors).toEqual(['Negro', 'Blanco']);
    });
  });

  describe('isCombinationAvailable', () => {
    it('retorna true para combinación activa', () => {
      expect(isCombinationAvailable(mockVariants, 'S', 'Negro')).toBe(true);
    });

    it('retorna false para combinación inactiva o inexistente', () => {
      expect(isCombinationAvailable(mockVariants, 'L', 'Blanco')).toBe(false);
      expect(isCombinationAvailable(mockVariants, 'XXL', 'Verde')).toBe(false);
    });
  });

  describe('buildCatalogItem', () => {
    it('calcula correctamente precios, rangos, imágenes y descuentos', () => {
      const item = buildCatalogItem({
        id: 'prod-1',
        slug: 'remera-oversize',
        title: 'Remera Oversize',
        category: mockCategory,
        variants: mockVariants,
        images: mockImages,
      });

      expect(item.id).toBe('prod-1');
      expect(item.slug).toBe('remera-oversize');
      expect(item.categoryName).toBe('Remeras');
      // La imagen principal debe ser la de menor sortOrder (img-1)
      expect(item.primaryImageUrl).toBe('https://images.unsplash.com/photo-1');
      // Rango de precios: min 2500000, max 2700000
      expect(item.minPriceInCents).toBe(2500000);
      expect(item.maxPriceInCents).toBe(2700000);
      expect(item.compareAtPriceInCents).toBe(3000000);
      expect(item.hasDiscount).toBe(true);
      expect(item.availableSizes).toEqual(['S', 'M']);
      expect(item.availableColors).toEqual(['Negro', 'Blanco']);
    });
  });
});
