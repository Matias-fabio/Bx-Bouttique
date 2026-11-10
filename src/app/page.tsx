import { ShoppingBag } from 'lucide-react';

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center py-12 text-center">
      {/* Tarjeta contenedor Durazno con radio de 28px */}
      <div className="bg-peach rounded-card p-8 sm:p-12 max-w-2xl w-full border border-sand/30 shadow-sm">
        <span className="inline-block bg-olive/15 text-olive text-xs font-semibold px-3 py-1 rounded-pill mb-4">
          Identidad: Calma urbana
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink mb-4">BX Boutique</h1>

        <p className="text-ink/80 text-base sm:text-lg mb-8 max-w-lg mx-auto">
          Andamiaje técnico y sistema de diseño base inicializados con éxito.
        </p>

        {/* Botón primario Terracota Profundo con radio pastilla */}
        <div className="flex justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-terracotta-deep hover:bg-terracotta-
                        hover text-white font-semibold text-sm h-11 px-6 rounded-pill transition-all active:scale-[0.98]
                        focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Próximamente: Catálogo (Corte 1)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
