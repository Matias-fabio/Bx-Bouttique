import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import '../styles/globals.css';
import { Header } from '@/ui/layout/Header';
import { Footer } from '@/ui/layout/Footer';

// Configuración de Montserrat como variable font
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'BX Boutique | Indumentaria Urbana y Deportiva',
    template: '%s | BX Boutique',
  },
  description:
    'Tienda online oficial de BX Boutique. Indumentaria urbana y deportiva femenina y unisex con envíos a todo el país y 3 cuotas sin interés.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'BX Boutique | Indumentaria Urbana y Deportiva',
    description:
      'Indumentaria urbana y deportiva femenina y unisex. Calidad premium, comodidad y calma urbana.',
    locale: 'es_AR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={montserrat.variable}>
      <body className="font-sans bg-cream text-ink antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
