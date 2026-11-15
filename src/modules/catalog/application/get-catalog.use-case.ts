import type { CatalogRepository } from '../infrastructure/catalog.repository';
import type { CatalogItem, Category } from '../domain/types';

export interface CatalogResult {
  categories: Category[];
  items: CatalogItem[];
  selectedCategorySlug?: string;
}

export class GetCatalogUseCase {
  constructor(private readonly repository: CatalogRepository) {}

  async execute(categorySlug?: string): Promise<CatalogResult> {
    const [categories, items] = await Promise.all([
      this.repository.getCategories(),
      this.repository.getCatalogItems(categorySlug),
    ]);

    return {
      categories,
      items,
      selectedCategorySlug: categorySlug,
    };
  }
}
