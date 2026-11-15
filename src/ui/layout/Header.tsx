import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Truck } from 'lucide-react';
import { Logo } from '@/ui/components/Logo';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-sand/40">
      {/* 1. Barra de Anuncio Superior */}
      <div className="bg-peach text-ink text-xs font-medium py-1.5 px-4 text-center border-b border-sand/30 flex items-center justify-center gap-2">
        <Truck className="w-3.5 h-3.5 text-terracotta-deep" />
        <span>Envíos a todo el país • 3 cuotas sin interés con Mercado Pago</span>
      </div>

      {/* 2. Barra Principal de Navegación */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Enlaces de Navegación Rápida */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink">
          <Link href="/" className="hover:text-terracotta-deep transition-colors">
            Catálogo
          </Link>
          <Link href="/?categoria=remeras" className="hover:text-terracotta-deep transition-colors">
            Remeras & Tops
          </Link>
          <Link href="/?categoria=buzos" className="hover:text-terracotta-deep transition-colors">
            Buzos & Hoodies
          </Link>
          <Link href="/?categoria=pantalones" className="hover:text-terracotta-deep transition-colors">
            Calzas & Joggers
          </Link>
        </nav>

        {/* Acciones de Cabecera (Carrito) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative p-2.5 rounded-pill text-ink hover:bg-peach transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
            aria-label="Abrir carrito de compras"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="sr-only">Carrito</span>
          </button>
        </div>
      </div>
    </header>
  );
};
