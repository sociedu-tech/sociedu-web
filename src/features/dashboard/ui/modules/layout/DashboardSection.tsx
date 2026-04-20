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
  const showHeader = Boolean(title) || Boolean(action);

  return (
    <section className={cn('space-y-4', className)}>
      {showHeader ? (
        <div
          className={cn(
            'flex flex-col gap-2 sm:flex-row sm:items-center',
            title ? 'sm:justify-between' : 'sm:justify-end',
          )}
        >
          {title ? (
            <h2 className="text-base font-semibold tracking-tight text-slate-900">{title}</h2>
          ) : null}
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
