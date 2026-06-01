'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function DashboardSurface({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-dashboard-border bg-dashboard-surface shadow-[var(--shadow-dashboard-card)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
