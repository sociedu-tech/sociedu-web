'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { StatsTimeRange } from './types';

const OPTIONS: { value: StatsTimeRange; label: string }[] = [
  { value: '7d', label: '7 ngày' },
  { value: '30d', label: '30 ngày' },
  { value: '90d', label: '90 ngày' },
  { value: '365d', label: '1 năm' },
];

type Props = {
  value: StatsTimeRange;
  onChange: (v: StatsTimeRange) => void;
  className?: string;
};

export function StatsTimeRangeFilter({ value, onChange, className }: Props) {
  return (
    <div
      className={cn(
        'inline-flex flex-wrap gap-1 rounded-xl border border-slate-200/90 bg-slate-50/80 p-1',
        className,
      )}
      role="group"
      aria-label="Khoảng thời gian"
    >
      {OPTIONS.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
              active
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
