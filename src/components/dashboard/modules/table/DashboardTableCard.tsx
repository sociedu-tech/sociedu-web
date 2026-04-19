import React from 'react';
import { cn } from '@/lib/utils';

/** Vỏ scroll ngang cho `<table>` — cùng hệ viền với `DashboardSurface`. */
export function DashboardTableCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}
