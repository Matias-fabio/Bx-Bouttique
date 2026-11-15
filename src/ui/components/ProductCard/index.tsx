import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Money } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { CatalogItem } from '@/modules/catalog/contracts';

export interface ProductCardProps {
  product: CatalogItem;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const isPriceRange = product.minPriceInCents !== product.maxPriceInCents;
  const formattedPrice = isPriceRange
    ? `Desde ${Money.fromCents(product.minPriceInCents).format()}`
    : Money.fromCents(product.minPriceInCents).format();

  const formattedComparePrice =
    product.compareAtPriceInCents && product.compareAtPriceInCents > product.minPriceInCents
      ? Money.fromCents(product.compareAtPriceInCents).format()
      : null;

  return (
    <article
      className={cn(
        'group bg-peach rounded-card p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1',
        className
      )}
    >
      <div>
        {/* Contenedor de la Imagen */}
        <Link
          href={`/producto/${product.slug}`}
          className="block aspect-square w-full relative rounded-img overflow-hidden bg-sand/20 mb-3 sm:mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          aria-label={`Ver detalles de ${product.title}`}
        >
          <Image
            src={product.primaryImageUrl}
            alt={product.primaryImageAlt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badge de Oferta */}
          {product.hasDiscount && (
            <span className="absolute top-2.5 left-2.5 bg-olive text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-pill shadow-xs uppercase tracking-wider">
              Oferta
            </span>
          )}
        </Link>

        {/* Categoría y Título */}
        <div className="space-y-1">
          <span className="text-[11px] sm:text-xs uppercase tracking-wider text-ink/70 font-medium block">
            {product.categoryName}
          </span>
          <h3 className="text-xs sm:text-base font-semibold text-ink leading-tight line-clamp-1">
            <Link
              href={`/producto/${product.slug}`}
              className="hover:text-terracotta-deep transition-colors"
            >
              {product.title}
            </Link>
          </h3>
        </div>

        {/* Talles disponibles */}
        {product.availableSizes.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="text-[10px] text-ink/60 uppercase font-medium">Talles:</span>
            {product.availableSizes.map((size) => (
              <span
                key={size}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-cream/70 text-ink/80 border border-sand/30"
              >
                {size}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Pie de la tarjeta: Precio y Acción */}
      <div className="pt-3 sm:pt-4 mt-2 border-t border-sand/30 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          {formattedComparePrice && (
            <span className="text-[10px] sm:text-xs text-ink/50 line-through leading-none mb-0.5">
              {formattedComparePrice}
            </span>
          )}
          <span className="inline-block bg-terracotta-deep text-white font-bold text-xs sm:text-sm px-2.5 sm:px-3 py-1 rounded-pill shadow-xs">
            {formattedPrice}
          </span>
        </div>

        <Link
          href={`/producto/${product.slug}`}
          className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-pill bg-cream text-ink hover:bg-terracotta-deep hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          aria-label={`Comprar ${product.title}`}
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
      </div>
    </article>
  );
};
