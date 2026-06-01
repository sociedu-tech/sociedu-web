'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  chartClassName?: string;
};

export function StatsChartCard({ title, subtitle, action, children, className, chartClassName }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border border-dashboard-border bg-dashboard-surface shadow-[var(--shadow-dashboard-card)]',
        className,
      )}
    >
      <div className="flex flex-col gap-2 border-b border-dashboard-border-subtle px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-dashboard-ink">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-dashboard-muted">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={cn('min-h-0 flex-1 px-2 pb-2 pt-1 sm:px-4 sm:pb-4', chartClassName)}>{children}</div>
    </div>
  );
}
