    'use client';

    import React, { useState } from 'react';
    import { ShoppingBag, Check, Plus, Minus } from 'lucide-react';
    import { Money } from '@/lib/money';
    import { cn } from '@/lib/utils';
    import { Button } from '@/ui/components/Button';
    import {
      findMatchingVariant,
      isCombinationAvailable,
      type ProductVariant,
    } from '@/modules/catalog/domain/types';

export interface VariantSelectorProps {
  variants: ProductVariant[];
  onAddToCart?: (variant: ProductVariant, quantity: number) => void;
  className?: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  onAddToCart,
  className,
}) => {
  // Obtener listas únicas de talles y colores disponibles
  const allSizes = Array.from(new Set(variants.map((v) => v.size)));
  const allColors = Array.from(new Set(variants.map((v) => v.color)));

  // Variante inicial por defecto (primera activa)
  const defaultVariant = variants.find((v) => v.isActive) ?? variants[0];

  const [selectedColor, setSelectedColor] = useState<string>(defaultVariant?.color ?? allColors[0] ?? '');
  const [selectedSize, setSelectedSize] = useState<string>(defaultVariant?.size ?? allSizes[0] ?? '');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  // Variante seleccionada actual
  const currentVariant = findMatchingVariant(variants, selectedSize, selectedColor);

  // Precios de la variante activa
  const price = currentVariant ? Money.fromCents(currentVariant.priceInCents).format() : null;
  const comparePrice =
    currentVariant?.compareAtPriceInCents && currentVariant.compareAtPriceInCents > currentVariant.priceInCents
      ? Money.fromCents(currentVariant.compareAtPriceInCents).format()
      : null;

  // Manejo de Agregar al Carrito
  const handleAddToCart = () => {
    if (!currentVariant) return;

    if (onAddToCart) {
      onAddToCart(currentVariant, quantity);
    }

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 1. Visualización reactiva de Precio */}
      <div className="flex items-baseline gap-3">
        {price ? (
          <>
            <span className="text-2xl sm:text-3xl font-bold text-ink">
              {price}
            </span>
            {comparePrice && (
              <span className="text-base sm:text-lg text-ink/50 line-through">
                {comparePrice}
              </span>
            )}
            {currentVariant?.compareAtPriceInCents && (
              <span className="bg-olive text-white text-xs font-semibold px-2.5 py-0.5 rounded-pill shadow-xs">
                Ahorrás{' '}
                {Money.fromCents(
                  currentVariant.compareAtPriceInCents - currentVariant.priceInCents
                ).format()}
              </span>
            )}
          </>
        ) : (
          <span className="text-lg text-error font-medium">
            Combinación no disponible
          </span>
        )}
      </div>

      {/* 2. Selector de Color */}
      {allColors.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">Color:</span>
            <span className="text-sm font-medium text-ink/70">{selectedColor}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allColors.map((color) => {
              const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
              const isAvailable = isCombinationAvailable(variants, selectedSize, color);

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'h-10 px-4 rounded-pill text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border select-none flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink',
                    isSelected
                      ? 'bg-peach border-2 border-terracotta-deep text-ink font-semibold shadow-xs'
                      : isAvailable
                        ? 'bg-cream border-sand text-ink hover:border-ink hover:bg-cream/80'
                        : 'bg-sand/10 border-sand/40 text-ink/40 line-through'
                  )}
                  aria-pressed={isSelected}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-terracotta-deep" />}
                  <span>{color}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Selector de Talle */}
      {allSizes.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">Talle:</span>
            <span className="text-sm font-medium text-ink/70">{selectedSize}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allSizes.map((size) => {
              const isSelected = selectedSize.toLowerCase() === size.toLowerCase();
              const isAvailable = isCombinationAvailable(variants, size, selectedColor);

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'min-w-11 h-10 px-3.5 rounded-pill text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border select-none flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink',
                    isSelected
                      ? 'bg-peach border-2 border-terracotta-deep text-ink font-semibold shadow-xs'
                      : isAvailable
                        ? 'bg-cream border-sand text-ink hover:border-ink hover:bg-cream/80'
                        : 'bg-sand/10 border-sand/40 text-ink/40 line-through cursor-not-allowed'
                  )}
                  aria-pressed={isSelected}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Selector de Cantidad y Botón de Compra */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Selector de Cantidad */}
        <div className="inline-flex items-center justify-between bg-cream border border-sand rounded-pill h-11 px-3 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || !currentVariant}
            className="w-7 h-7 flex items-center justify-center text-ink/80 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Disminuir cantidad"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center font-semibold text-sm select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            disabled={!currentVariant}
            className="w-7 h-7 flex items-center justify-center text-ink/80 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Aumentar cantidad"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Botón Principal */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={!currentVariant}
          onClick={handleAddToCart}
          className="flex-1 w-full gap-2 text-sm sm:text-base"
        >
          {addedFeedback ? (
            <>
              <Check className="w-5 h-5 text-white" />
              <span>¡Agregado al Carrito!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5 text-white" />
              <span>{currentVariant ? 'Agregar al Carrito' : 'No disponible'}</span>
            </>
          )}
        </Button>
      </div>

      {/* Información de SKU y Envíos */}
      <div className="pt-4 border-t border-sand/40 space-y-1.5 text-xs text-ink/70">
        {currentVariant && (
          <p>
            <span className="font-semibold text-ink">SKU:</span> {currentVariant.sku}
          </p>
        )}
        <p>
          <span className="font-semibold text-ink">Envío:</span> Entregas en CABA, GBA e Interior del país. Retiro gratis en local físico.
        </p>
      </div>
    </div>
  );
};
