import { db, client } from './index';
import { categories, products, productVariants, productImages } from './schema';
import { SEED_CATEGORIES, SEED_PRODUCTS } from './seed-data';

async function seed() {
  console.log('🌱 Iniciando siembra de datos de prueba en la base de datos...');

  try {
    // 1. Insertar Categorías
    for (const cat of SEED_CATEGORIES) {
      await db
        .insert(categories)
        .values({
          id: cat.id,
          slug: cat.slug,
          name: cat.name,
          sortOrder: cat.sortOrder,
          isActive: cat.isActive,
        })
        .onConflictDoUpdate({
          target: categories.slug,
          set: {
            name: cat.name,
            sortOrder: cat.sortOrder,
            isActive: cat.isActive,
          },
        });
    }
    console.log(`✓ ${SEED_CATEGORIES.length} categorías sincronizadas.`);

    // 2. Insertar Productos, Variantes e Imágenes
    for (const prod of SEED_PRODUCTS) {
      await db
        .insert(products)
        .values({
          id: prod.id,
          categoryId: prod.category.id,
          slug: prod.slug,
          title: prod.title,
          description: prod.description,
          isActive: prod.isActive,
        })
        .onConflictDoUpdate({
          target: products.slug,
          set: {
            categoryId: prod.category.id,
            title: prod.title,
            description: prod.description,
            isActive: prod.isActive,
          },
        });

      // Variantes
      for (const variant of prod.variants) {
        await db
          .insert(productVariants)
          .values({
            id: variant.id,
            productId: variant.productId,
            sku: variant.sku,
            size: variant.size,
            color: variant.color,
            priceInCents: variant.priceInCents,
            compareAtPriceInCents: variant.compareAtPriceInCents,
            isActive: variant.isActive,
          })
          .onConflictDoUpdate({
            target: productVariants.sku,
            set: {
              size: variant.size,
              color: variant.color,
              priceInCents: variant.priceInCents,
              compareAtPriceInCents: variant.compareAtPriceInCents,
              isActive: variant.isActive,
            },
          });
      }

      // Imágenes
      for (const image of prod.images) {
        await db
          .insert(productImages)
          .values({
            id: image.id,
            productId: image.productId,
            variantId: image.variantId,
            url: image.url,
            altText: image.altText,
            sortOrder: image.sortOrder,
          })
          .onConflictDoNothing();
      }
    }

    console.log(`✓ ${SEED_PRODUCTS.length} productos y sus variantes sincronizados.`);
    console.log('✅ Siembra completada con éxito.');
  } catch (error) {
    console.error('❌ Error durante la siembra de datos:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seed();
