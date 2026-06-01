'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function DashboardSection({
  title,
  children,
  className,
  action,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  const showHeader = Boolean(action);

  return (
    <section className={cn('space-y-4', className)}>
      {showHeader ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <div className="shrink-0">{action}</div>
        </div>
      ) : null}
      {children}
    </section>
  );
}
