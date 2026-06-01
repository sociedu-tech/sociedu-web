'use client';

import { cn } from '@/lib/utils';
import { PROGRAM_FILTERS, type ProgramFilter } from '@/features/dashboard/lib/programFilters';

type Props = {
  value: ProgramFilter;
  onChange: (value: ProgramFilter) => void;
  counts?: Partial<Record<ProgramFilter, number>>;
};

export function ProgramFilters({ value, onChange, counts }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {PROGRAM_FILTERS.map((filter) => {
        const active = value === filter.id;
        const count = counts?.[filter.id];
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition',
              active
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700',
            )}
          >
            {filter.label}
            {count != null ? ` (${count})` : ''}
          </button>
        );
      })}
    </div>
  );
}
