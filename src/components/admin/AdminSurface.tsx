'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function AdminSurface({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}
