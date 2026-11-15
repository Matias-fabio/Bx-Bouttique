import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/ui/components/Button';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-pill bg-peach text-terracotta-deep shadow-xs mx-auto">
        <ShoppingBag className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Prenda no encontrada
        </h1>
        <p className="text-sm sm:text-base text-ink/70 leading-relaxed">
          La prenda que estás buscando no existe o fue retirada del catálogo.
        </p>
      </div>

      <div>
        <Link href="/">
          <Button variant="primary" size="md">
            Volver al Catálogo
          </Button>
        </Link>
      </div>
    </div>
  );
}
