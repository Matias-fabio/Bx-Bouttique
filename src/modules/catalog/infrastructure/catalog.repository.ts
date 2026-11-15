import { eq, asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories, products } from './schema';
import {
  type Category,
  type CatalogItem,
  type ProductDetail,
  buildCatalogItem,
} from '../domain/types';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '@/lib/db/seed-data';

export interface CatalogRepository {
  getCategories(): Promise<Category[]>;
  getCatalogItems(categorySlug?: string): Promise<CatalogItem[]>;
  getProductBySlug(slug: string): Promise<ProductDetail | null>;
}

export class DrizzleCatalogRepository implements CatalogRepository {
  async getCategories(): Promise<Category[]> {
    try {
      const rows = await db.query.categories.findMany({
        where: eq(categories.isActive, true),
        orderBy: [asc(categories.sortOrder)],
      });

      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          slug: r.slug,
          name: r.name,
          sortOrder: r.sortOrder,
          isActive: r.isActive,
        }));
      }
      return SEED_CATEGORIES;
    } catch {
      // Fallback resiliente si la base de datos no está levantada en entorno de desarrollo
      return SEED_CATEGORIES;
    }
  }

  async getCatalogItems(categorySlug?: string): Promise<CatalogItem[]> {
    try {
      const rows = await db.query.products.findMany({
        where: eq(products.isActive, true),
        with: {
          category: true,
          variants: true,
          images: true,
        },
      });

      if (rows && rows.length > 0) {
        let items = rows.map((r) =>
          buildCatalogItem({
            id: r.id,
            slug: r.slug,
            title: r.title,
            category: r.category,
            variants: r.variants.map((v) => ({
              ...v,
              compareAtPriceInCents: v.compareAtPriceInCents,
            })),
            images: r.images,
          })
        );

        if (categorySlug) {
          items = items.filter((i) => i.categorySlug.toLowerCase() === categorySlug.toLowerCase());
        }

        return items;
      }

      return this.filterSeedCatalog(categorySlug);
    } catch {
      // Fallback resiliente
      return this.filterSeedCatalog(categorySlug);
    }
  }

  async getProductBySlug(slug: string): Promise<ProductDetail | null> {
    try {
      const row = await db.query.products.findFirst({
        where: eq(products.slug, slug),
        with: {
          category: true,
          variants: true,
          images: true,
        },
      });

      if (row && row.isActive) {
        return {
          id: row.id,
          slug: row.slug,
          title: row.title,
          description: row.description,
          isActive: row.isActive,
          category: row.category,
          variants: row.variants.filter((v) => v.isActive),
          images: [...row.images].sort((a, b) => a.sortOrder - b.sortOrder),
        };
      }

      const seedMatch = SEED_PRODUCTS.find((p) => p.slug === slug && p.isActive);
      return seedMatch ?? null;
    } catch {
      const seedMatch = SEED_PRODUCTS.find((p) => p.slug === slug && p.isActive);
      return seedMatch ?? null;
    }
  }

  private filterSeedCatalog(categorySlug?: string): CatalogItem[] {
    let list = SEED_PRODUCTS.map((p) => buildCatalogItem(p));
    if (categorySlug) {
      list = list.filter((i) => i.categorySlug.toLowerCase() === categorySlug.toLowerCase());
    }
    return list;
  }
}

export const catalogRepository = new DrizzleCatalogRepository();
