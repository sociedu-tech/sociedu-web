'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  deltaPct?: number;
  icon: LucideIcon;
  /** `featured`: nền slate-900 giống sidebar. `default`: thẻ trắng, icon dùng primary. */
  tone?: 'default' | 'featured';
  className?: string;
};

export function StatsKpiCard({
  label,
  value,
  hint,
  deltaPct,
  icon: Icon,
  tone = 'default',
  className,
}: Props) {
  const formatted =
    typeof value === 'number' ? value.toLocaleString('vi-VN') : value;

  const isFeatured = tone === 'featured';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-5 shadow-sm',
        className,
        isFeatured
          ? 'border-slate-800 bg-[var(--color-dashboard-ink)] text-slate-100'
          : 'border-slate-200/80 bg-white text-slate-900',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              'text-[11px] font-semibold uppercase tracking-wider',
              isFeatured ? 'text-slate-400' : 'text-slate-500',
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              'mt-2 text-2xl font-semibold tabular-nums tracking-tight',
              isFeatured ? 'text-white' : 'text-slate-900',
            )}
          >
            {formatted}
          </p>
          {hint ? (
            <p className={cn('mt-1 text-xs', isFeatured ? 'text-slate-400' : 'text-slate-500')}>
              {hint}
            </p>
          ) : null}
          {deltaPct != null ? (
            <p
              className={cn(
                'mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
                deltaPct >= 0
                  ? isFeatured
                    ? 'bg-primary/25 text-white'
                    : 'bg-primary/10 text-primary'
                  : isFeatured
                    ? 'bg-white/10 text-slate-200'
                    : 'bg-slate-100 text-slate-700',
              )}
            >
              {deltaPct >= 0 ? '+' : ''}
              {deltaPct.toFixed(1)}% so với kỳ trước
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl ring-1',
            isFeatured
              ? 'bg-primary text-white ring-primary/40'
              : 'bg-primary/10 text-primary ring-primary/20',
          )}
        >
          <Icon className="size-5" strokeWidth={2} aria-hidden />
        </div>
      </div>
    </div>
  );
}
