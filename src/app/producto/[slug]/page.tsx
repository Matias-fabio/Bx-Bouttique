import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { getProductBySlug, getCatalog } from '@/modules/catalog/contracts';
import { ProductGallery } from '@/ui/components/ProductGallery';
import { VariantSelector } from '@/ui/components/VariantSelector';
import { ProductCard } from '@/ui/components/ProductCard';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: ProductPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Producto no encontrado | BX Boutique',
    };
  }

  const primaryImage = product.images[0]?.url;

  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.title} | BX Boutique`,
      description: product.description,
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductPage(props: ProductPageProps) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Obtener prendas relacionadas de la misma categoría para enriquecer la experiencia
  const catalog = await getCatalog(product.category.slug);
  const relatedItems = catalog.items.filter((item) => item.slug !== product.slug).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16">
      {/* 1. Breadcrumbs / Volver */}
      <nav
        aria-label="Ruta de navegación"
        className="flex items-center gap-1.5 text-xs text-ink/65 flex-wrap"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:text-terracotta-deep transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Catálogo</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-sand" />
        <Link
          href={`/?categoria=${product.category.slug}`}
          className="hover:text-terracotta-deep transition-colors"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="w-3 h-3 text-sand" />
        <span className="text-ink font-semibold truncate max-w-[200px] sm:max-w-none">
          {product.title}
        </span>
      </nav>

      {/* 2. Ficha Principal de Producto (2 Columnas) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-start">
        {/* Columna Izquierda: Galería de Fotos */}
        <div className="w-full">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Columna Derecha: Detalles, Talles/Colores y Compra */}
        <div className="space-y-6">
          {/* Categoría y Título */}
          <div className="space-y-2">
            <Link
              href={`/?categoria=${product.category.slug}`}
              className="text-xs uppercase tracking-wider text-terracotta-deep font-semibold hover:underline"
            >
              {product.category.name}
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink tracking-tight leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Descripción del Producto */}
          <div className="prose prose-sm text-ink/80 leading-relaxed pt-1 border-t border-sand/30">
            <p>{product.description}</p>
          </div>

          {/* Selector de Talle, Color, Cantidad y Botón de Carrito */}
          <div className="pt-2">
            <VariantSelector variants={product.variants} />
          </div>
        </div>
      </section>

      {/* 3. Prendas Relacionadas */}
      {relatedItems.length > 0 && (
        <section className="pt-10 border-t border-sand/40 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-ink tracking-tight">
              Completá tu look
            </h2>
            <Link
              href={`/?categoria=${product.category.slug}`}
              className="text-xs sm:text-sm font-semibold text-terracotta-deep hover:underline"
            >
              Ver más en {product.category.name} →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
            {relatedItems.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
