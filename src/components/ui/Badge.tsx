import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

/** Nhãn pill primary — khớp `.badge-primary` trong `globals.css`. */
export function Badge({ children, className, ...rest }: BadgeProps) {
  return (
    <span className={cn('badge-primary', className)} {...rest}>
      {children}
    </span>
  );
}
