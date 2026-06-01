'use client';

import { useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DataPagination } from '@/components/ui/DataPagination';
import { useProgramBookings } from '@/features/dashboard/hooks/useProgramBookings';
import { ProgramSessionCard } from '@/features/dashboard/ui/programs/ProgramSessionCard';
import { ProgramFilters } from '@/features/dashboard/ui/programs/ProgramFilters';
import { filterProgramItems, type ProgramFilter } from '@/features/dashboard/lib/programFilters';
import type { ProgramLabels } from '@/features/dashboard/lib/programLabels';

type Props = {
  perspective: 'buyer' | 'mentor';
  labels: ProgramLabels;
  detailPath: (bookingId: string) => string;
};

export function ProgramList({ perspective, labels, detailPath }: Props) {
  const { items, loading, error, refresh, page, size, total, totalPages, setPage, setSize } =
    useProgramBookings(perspective);
  const [filter, setFilter] = useState<ProgramFilter>('all');

  const filteredItems = useMemo(() => filterProgramItems(items, filter), [items, filter]);

  const filterCounts = useMemo(
    () =>
      ({
        all: items.length,
        active: filterProgramItems(items, 'active').length,
        upcoming: filterProgramItems(items, 'upcoming').length,
        completed: filterProgramItems(items, 'completed').length,
        canceled: filterProgramItems(items, 'canceled').length,
      }) satisfies Partial<Record<ProgramFilter, number>>,
    [items],
  );

  if (loading && items.length === 0) {
    return <PageLoadingState label={`Đang tải ${labels.nav.toLowerCase()}…`} variant="cards" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="space-y-6">
      {items.length > 0 ? (
        <ProgramFilters value={filter} onChange={setFilter} counts={filterCounts} />
      ) : null}

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-slate-500 shadow-sm">
          <BookOpen className="size-10 text-slate-300" strokeWidth={1.5} />
          <p className="font-medium text-slate-700">{labels.emptyTitle}</p>
          <p className="text-sm text-slate-500">{labels.emptyHint}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <p className="rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-sm text-slate-500">
          {labels.filterEmpty}
        </p>
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <ProgramSessionCard
              key={item.bookingId}
              item={item}
              labels={labels}
              detailPath={detailPath(item.bookingId)}
            />
          ))}
        </div>
      )}

      <DataPagination
        page={page}
        size={size}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onSizeChange={setSize}
        disabled={loading}
      />
    </div>
  );
}
