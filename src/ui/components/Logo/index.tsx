import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center text-xl sm:text-2xl font-extrabold tracking-tight 
            text-ink hover:opacity-90 transition-opacity ${className}`}
      aria-label="BX Boutique - Inicio"
    >
      <span>Bx</span>
      <span className="font-light ml-1 text-terracotta">Boutique</span>
    </Link>
  );
}
