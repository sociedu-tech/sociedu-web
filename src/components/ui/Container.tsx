import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ContainerProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/** Lề trang — căn giữa, giới hạn chiều rộng (khớp Navbar/Footer). */
export function Container({ children, className, ...rest }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 md:px-6', className)} {...rest}>
      {children}
    </div>
  );
}
