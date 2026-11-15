import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ChipProps {
  label: string;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
  count?: number;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  isActive = false,
  href,
  onClick,
  className,
  count,
}) => {
  const chipStyles = cn(
    'inline-flex items-center gap-2 h-9 px-4 rounded-pill text-xs sm:text-sm transition-all duration-200 select-none whitespace-nowrap cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1',
    isActive
      ? 'bg-peach border-2 border-terracotta-deep text-ink font-semibold shadow-xs'
      : 'bg-cream/60 border border-sand text-ink hover:border-ink hover:bg-cream',
    className
  );

  const content = (
    <>
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={cn(
            'text-[10px] px-1.5 py-0.5 rounded-pill font-mono',
            isActive ? 'bg-terracotta-deep text-white' : 'bg-sand/30 text-ink'
          )}
        >
          {count}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={chipStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={chipStyles}>
      {content}
    </button>
  );
};
