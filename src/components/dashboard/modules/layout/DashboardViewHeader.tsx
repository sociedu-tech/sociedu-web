'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function DashboardViewHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  layout = 'compact',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  layout?: 'compact' | 'featured';
}) {
  if (!action) return null;

  return (
    <header className={cn('mb-4 sm:mb-6 flex w-full justify-end', className)}>
      <div className="shrink-0 w-full sm:w-auto">{action}</div>
    </header>
  );
}
