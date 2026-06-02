'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useIsAdminDashboard } from '@/features/dashboard/hooks/useIsAdminDashboard';

export function DashboardViewHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  layout = 'compact',
  forceShow = false,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  layout?: 'compact' | 'featured';
  /** Bỏ qua ẩn mặc định trên admin (chỉ dùng khi thật sự cần). */
  forceShow?: boolean;
}) {
  const isAdmin = useIsAdminDashboard();

  if (isAdmin && !forceShow) {
    if (!action) return null;
    return (
      <header className={cn('flex shrink-0 justify-end pb-2', className)}>
        <div className="flex flex-wrap items-center gap-2">{action}</div>
      </header>
    );
  }

  if (!title && !description && !action && !eyebrow) return null;

  const featured = layout === 'featured';

  return (
    <header
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        featured && 'rounded-2xl border border-dashboard-border bg-dashboard-surface p-5 sm:p-6',
        featured && 'shadow-[var(--shadow-dashboard-card)]',
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <p className="dashboard-section-title text-primary">{eyebrow}</p>
        ) : null}
        {title ? (
          <h1 className={cn('dashboard-page-title', eyebrow && 'mt-1', featured && 'sm:text-3xl')}>
            {title}
          </h1>
        ) : null}
        {description ? <p className="dashboard-page-desc">{description}</p> : null}
      </div>
      {action ? (
        <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {action}
        </div>
      ) : null}
    </header>
  );
}
