import { catalogRepository } from './infrastructure/catalog.repository';
import { GetCatalogUseCase, type CatalogResult } from './application/get-catalog.use-case';
import { GetProductBySlugUseCase } from './application/get-product-by-slug.use-case';

// Exportación de tipos y contratos públicos hacia otros módulos y capa web
export type {
  Category,
  CatalogItem,
  ProductDetail,
  ProductVariant,
  ProductImage,
} from './domain/types';

export {
  findMatchingVariant,
  getAvailableSizesForColor,
  getAvailableColorsForSize,
  isCombinationAvailable,
} from './domain/types';

export type { CatalogResult };

// Casos de uso instanciados para consumo directo
const getCatalogUseCase = new GetCatalogUseCase(catalogRepository);
const getProductBySlugUseCase = new GetProductBySlugUseCase(catalogRepository);

export async function getCatalog(categorySlug?: string): Promise<CatalogResult> {
  return getCatalogUseCase.execute(categorySlug);
}

export async function getProductBySlug(slug: string) {
  return getProductBySlugUseCase.execute(slug);
}

export async function getCategories() {
  return catalogRepository.getCategories();
}
