import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CardVariant = 'dashboard' | 'surface' | 'outline';

const variantClass: Record<CardVariant, string> = {
  dashboard: 'rounded-2xl border border-slate-200/80 bg-white',
  surface: 'glass-card',
  outline: 'rounded-xl border border-border bg-white',
};

type CardProps = {
  variant?: CardVariant;
  /** Bọc padding nội dung (dashboard: p-5 sm:p-6; các variant khác: p-4) */
  padding?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/**
 * Khối nền + viền dùng chung (dashboard, thẻ marketing).
 * Trùng ý với `DashboardCard` — ưu tiên import từ `@/components/ui`.
 */
export function Card({ variant = 'dashboard', padding = true, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        variantClass[variant],
        padding &&
          (variant === 'dashboard'
            ? 'p-5 sm:p-6'
            : variant === 'surface'
              ? 'p-4'
              : 'p-4 sm:p-5'),
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
