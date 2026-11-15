import type { CatalogRepository } from '../infrastructure/catalog.repository';
import type { ProductDetail } from '../domain/types';

export class GetProductBySlugUseCase {
  constructor(private readonly repository: CatalogRepository) {}

  async execute(slug: string): Promise<ProductDetail | null> {
    if (!slug || slug.trim() === '') {
      return null;
    }

    return this.repository.getProductBySlug(slug.trim());
  }
}
