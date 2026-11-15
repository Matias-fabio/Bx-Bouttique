'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/modules/catalog/contracts';

export interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
  className?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title, className }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentImage = images[selectedIndex] ?? {
    url: '/images/placeholder.svg',
    altText: title,
  };

  return (
    <div className={cn('flex flex-col gap-3 sm:gap-4', className)}>
      {/* Imagen Principal */}
      <div className="relative aspect-square w-full rounded-img overflow-hidden bg-sand/15 shadow-xs border border-sand/30">
        <Image
          src={currentImage.url}
          alt={currentImage.altText || title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {/* Tira de Miniaturas (si hay más de 1 imagen) */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  'relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-md overflow-hidden bg-sand/15 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-deep',
                  isSelected
                    ? 'ring-2 ring-terracotta-deep ring-offset-2 ring-offset-cream opacity-100 scale-102'
                    : 'opacity-70 hover:opacity-100 border border-sand/40'
                )}
                aria-label={`Ver foto ${idx + 1} de ${title}`}
                aria-pressed={isSelected}
              >
                <Image
                  src={img.url}
                  alt={img.altText || `${title} miniatura ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
