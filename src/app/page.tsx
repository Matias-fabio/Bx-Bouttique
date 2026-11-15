import React from 'react';
import { getCatalog } from '@/modules/catalog/contracts';
import { ProductCard } from '@/ui/components/ProductCard';
import { Chip } from '@/ui/components/Chip';
import { Sparkles } from 'lucide-react';

interface HomePageProps {
  searchParams?: Promise<{ categoria?: string }>;
}

export default async function HomePage(props: HomePageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const selectedCategory = searchParams.categoria;

  // Invocar caso de uso del catálogo
  const catalog = await getCatalog(selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
      {/* 1. Hero / Banner Editorial "Calma Urbana" */}
      <section className="bg-peach/70 rounded-card p-6 sm:p-10 md:p-14 border border-sand/40 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cream text-terracotta-deep text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nueva Colección 2026</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-ink tracking-tight leading-tight">
            Indumentaria con calma urbana.
          </h1>
          <p className="text-sm sm:text-base text-ink/80 leading-relaxed">
            Prendas básicas y deportivas diseñadas para acompañarte todos los días. Confort genuino, tejidos nobles y siluetas contemporáneas.
          </p>
        </div>
      </section>

      {/* 2. Barra de Categorías / Filtros */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-ink tracking-tight">
            Explorá por categoría
          </h2>
          <span className="text-xs text-ink/60 font-medium">
            {catalog.items.length} {catalog.items.length === 1 ? 'prenda' : 'prendas'}
          </span>
        </div>

        {/* Chips de filtro con scroll horizontal suave en celulares */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Chip
            label="Todos los productos"
            href="/"
            isActive={!selectedCategory}
            count={!selectedCategory ? catalog.items.length : undefined}
          />
          {catalog.categories.map((cat) => {
            const isCatActive = selectedCategory?.toLowerCase() === cat.slug.toLowerCase();
            return (
              <Chip
                key={cat.id}
                label={cat.name}
                href={`/?categoria=${cat.slug}`}
                isActive={isCatActive}
              />
            );
          })}
        </div>
      </section>

      {/* 3. Grilla de Productos */}
      <section>
        {catalog.items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {catalog.items.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-peach/30 rounded-card border border-sand/30 p-8 space-y-3">
            <p className="text-base font-semibold text-ink">
              No encontramos prendas en esta categoría por el momento.
            </p>
            <p className="text-xs sm:text-sm text-ink/60">
              Podés explorar todas las prendas disponibles en nuestra tienda.
            </p>
            <div className="pt-2">
              <Chip label="Ver todo el catálogo" href="/" isActive={true} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
