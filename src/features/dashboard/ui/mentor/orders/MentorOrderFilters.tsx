'use client';

import { cn } from '@/lib/utils';
import {
  MENTOR_ORDER_FILTERS,
  type MentorOrderFilter,
} from '@/features/dashboard/hooks/useMentorOrders';

type Props = {
  value: MentorOrderFilter;
  onChange: (value: MentorOrderFilter) => void;
};

export function MentorOrderFilters({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {MENTOR_ORDER_FILTERS.map((filter) => {
        const active = value === filter.id;
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
          </button>
        );
      })}
    </div>
  );
}
