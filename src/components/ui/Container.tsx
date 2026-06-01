import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ContainerProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/** Lề trang — full width + padding ngang. */
export function Container({ children, className, ...rest }: ContainerProps) {
  return (
    <div className={cn('w-full px-4 md:px-6', className)} {...rest}>
      {children}
    </div>
  );
}
