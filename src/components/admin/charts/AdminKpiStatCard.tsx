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
  accent?: 'indigo' | 'emerald' | 'violet' | 'amber';
  className?: string;
};

const accentRing: Record<NonNullable<Props['accent']>, string> = {
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  amber: 'bg-amber-50 text-amber-800 ring-amber-100',
};

export function AdminKpiStatCard({
  label,
  value,
  hint,
  deltaPct,
  icon: Icon,
  accent = 'indigo',
  className,
}: Props) {
  const formatted =
    typeof value === 'number' ? value.toLocaleString('vi-VN') : value;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-slate-900">{formatted}</p>
          {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
          {deltaPct != null ? (
            <p
              className={cn(
                'mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
                deltaPct >= 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800',
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
            accentRing[accent],
          )}
        >
          <Icon className="size-5" strokeWidth={2} aria-hidden />
        </div>
      </div>
    </div>
  );
}
