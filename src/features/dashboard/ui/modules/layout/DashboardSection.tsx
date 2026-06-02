'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useIsAdminDashboard } from '@/features/dashboard/hooks/useIsAdminDashboard';

export function DashboardSection({
  title,
  description,
  children,
  className,
  action,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  const isAdmin = useIsAdminDashboard();
  const sectionDescription = isAdmin ? undefined : description;
  const showHeader = Boolean(title || sectionDescription || action);

  return (
    <section className={cn('space-y-4', className)} aria-label={title}>
      {showHeader ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-base font-semibold tracking-tight text-dashboard-ink">{title}</h2>
            ) : null}
            {sectionDescription ? (
              <p className="mt-0.5 text-sm leading-relaxed text-dashboard-muted">{sectionDescription}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
