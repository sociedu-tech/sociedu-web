'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function DashboardViewHeader({
  action,
  className,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  layout?: 'compact' | 'featured';
}) {
  if (!action) return null;

  return (
    <header
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-end',
        className,
      )}
    >
      <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">{action}</div>
    </header>
  );
}
