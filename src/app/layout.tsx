import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import '../styles/globals.css';
import { Logo } from '@/ui/components/Logo';

// Configuración de Montserrat como variable font (100 a 900)
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BX Boutique | Indumentaria Urbana y Deportiva',
  description:
    'Tienda online oficial de BX Boutique. Ropa urbana y deportiva con envíos a todo el país.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={montserrat.variable}>
      <body className="font-sans bg-cream text-ink antialiased flex flex-col min-h-screen">
        {/* Cabecera mínima del andamiaje */}
        <header className="border-b border-sand/40 bg-cream/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Logo />
            <div className="text-xs uppercase tracking-wider text-sand font-medium">
              Corte 0: Base
            </div>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>

        {/* Pie de página mínimo */}
        <footer className="border-t border-sand/40 py-6 text-center text-xs text-ink/60">
          <p>© {new Date().getFullYear()} BX Boutique. Todos los derechos reservados.</p>
        </footer>
      </body>
    </html>
  );
}
