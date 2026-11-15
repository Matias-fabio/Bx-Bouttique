import React from 'react';
import Link from 'next/link';
import { Logo } from '@/ui/components/Logo';
import { ShieldCheck, RefreshCw, CreditCard, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-peach/60 border-t border-sand/40 text-ink pt-12 pb-8 mt-16 sm:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pilares de Confianza */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-sand/40">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-terracotta-deep shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-ink">Cuotas sin interés</h4>
              <p className="text-xs text-ink/70 mt-0.5">Pagos seguros con Mercado Pago</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-terracotta-deep shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-ink">Compra 100% segura</h4>
              <p className="text-xs text-ink/70 mt-0.5">Tus datos siempre protegidos</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-terracotta-deep shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-ink">Cambios sin vueltas</h4>
              <p className="text-xs text-ink/70 mt-0.5">Hasta 30 días para cambiar tu prenda</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-terracotta-deep shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-ink">Retiro en local</h4>
              <p className="text-xs text-ink/70 mt-0.5">Gratis en nuestro punto físico</p>
            </div>
          </div>
        </div>

        {/* Columnas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          <div className="space-y-3">
            <Logo />
            <p className="text-xs sm:text-sm text-ink/75 leading-relaxed max-w-sm">
              Indumentaria urbana y deportiva femenina y unisex pensada desde la calma, la comodidad y el estilo moderno cotidiano.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink mb-3">
              Categorías
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-ink/80">
              <li>
                <Link href="/?categoria=remeras" className="hover:text-terracotta-deep transition-colors">
                  Remeras & Tops
                </Link>
              </li>
              <li>
                <Link href="/?categoria=buzos" className="hover:text-terracotta-deep transition-colors">
                  Buzos & Hoodies
                </Link>
              </li>
              <li>
                <Link href="/?categoria=pantalones" className="hover:text-terracotta-deep transition-colors">
                  Pantalones & Calzas
                </Link>
              </li>
              <li>
                <Link href="/?categoria=camperas" className="hover:text-terracotta-deep transition-colors">
                  Camperas & Abrigos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink mb-3">
              Atención al Cliente
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-ink/80">
              <li>Envíos a todo el país</li>
              <li>Políticas de cambio y garantía</li>
              <li>Preguntas frecuentes</li>
              <li>Buenos Aires, Argentina</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-sand/30 flex flex-col sm:flex-row items-center justify-between text-xs text-ink/60 gap-3">
          <p>© {new Date().getFullYear()} BX Boutique. Todos los derechos reservados.</p>
          <p>Precios expresados en Pesos Argentinos (ARS).</p>
        </div>
      </div>
    </footer>
  );
};
