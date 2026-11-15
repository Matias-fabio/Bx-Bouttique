import { describe, it, expect } from 'vitest';
import { GetCatalogUseCase } from './get-catalog.use-case';
import { GetProductBySlugUseCase } from './get-product-by-slug.use-case';
import type { CatalogRepository } from '../infrastructure/catalog.repository';
import type { Category, CatalogItem, ProductDetail } from '../domain/types';

const mockCategory: Category = {
  id: 'cat-1',
  slug: 'remeras',
  name: 'Remeras',
  sortOrder: 1,
  isActive: true,
};

const mockCatalogItem: CatalogItem = {
  id: 'prod-1',
  slug: 'remera-oversize',
  title: 'Remera Oversize',
  categoryName: 'Remeras',
  categorySlug: 'remeras',
  primaryImageUrl: 'https://images.unsplash.com/photo-1',
  primaryImageAlt: 'Remera',
  minPriceInCents: 2500000,
  maxPriceInCents: 2500000,
  compareAtPriceInCents: null,
  availableSizes: ['S', 'M'],
  availableColors: ['Negro'],
  hasDiscount: false,
};

const mockProductDetail: ProductDetail = {
  id: 'prod-1',
  slug: 'remera-oversize',
  title: 'Remera Oversize',
  description: 'Remera de algodón 100%',
  isActive: true,
  category: mockCategory,
  variants: [
    {
      id: 'var-1',
      productId: 'prod-1',
      sku: 'REM-NEG-S',
      size: 'S',
      color: 'Negro',
      priceInCents: 2500000,
      compareAtPriceInCents: null,
      isActive: true,
    },
  ],
  images: [
    {
      id: 'img-1',
      productId: 'prod-1',
      variantId: null,
      url: 'https://images.unsplash.com/photo-1',
      altText: 'Foto',
      sortOrder: 1,
    },
  ],
};

class MockCatalogRepository implements CatalogRepository {
  async getCategories(): Promise<Category[]> {
    return [mockCategory];
  }

  async getCatalogItems(categorySlug?: string): Promise<CatalogItem[]> {
    if (categorySlug && categorySlug !== 'remeras') {
      return [];
    }
    return [mockCatalogItem];
  }

  async getProductBySlug(slug: string): Promise<ProductDetail | null> {
    if (slug === 'remera-oversize') {
      return mockProductDetail;
    }
    return null;
  }
}

describe('Catalog Use Cases', () => {
  const repo = new MockCatalogRepository();

  describe('GetCatalogUseCase', () => {
    it('retorna categorías y productos para el catálogo general', async () => {
      const useCase = new GetCatalogUseCase(repo);
      const result = await useCase.execute();

      expect(result.categories).toHaveLength(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].slug).toBe('remera-oversize');
      expect(result.selectedCategorySlug).toBeUndefined();
    });

    it('aplica filtro de categoría cuando se proporciona', async () => {
      const useCase = new GetCatalogUseCase(repo);
      const result = await useCase.execute('buzos');

      expect(result.items).toHaveLength(0);
      expect(result.selectedCategorySlug).toBe('buzos');
    });
  });

  describe('GetProductBySlugUseCase', () => {
    it('obtiene el detalle del producto cuando el slug existe', async () => {
      const useCase = new GetProductBySlugUseCase(repo);
      const product = await useCase.execute('remera-oversize');

      expect(product).toBeDefined();
      expect(product?.title).toBe('Remera Oversize');
      expect(product?.variants).toHaveLength(1);
    });

    it('retorna null cuando el slug no existe o está vacío', async () => {
      const useCase = new GetProductBySlugUseCase(repo);
      const result1 = await useCase.execute('inexistente');
      const result2 = await useCase.execute('');

      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });
});
