'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEFAULT_PAGE_SIZE } from '@/lib/apiUtils';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

type Props = {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSizeChange?: (size: number) => void;
  className?: string;
  disabled?: boolean;
};

export function DataPagination({
  page,
  size,
  total,
  totalPages,
  onPageChange,
  onSizeChange,
  className,
  disabled,
}: Props) {
  const safeTotalPages = Math.max(totalPages, total > 0 ? 1 : 0);
  const from = total === 0 ? 0 : page * size + 1;
  const to = Math.min((page + 1) * size, total);
  const canPrev = page > 0 && !disabled;
  const canNext = page + 1 < safeTotalPages && !disabled;

  if (total === 0 && !onSizeChange) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <p className="text-xs text-slate-500">
        {total === 0 ? (
          'Không có bản ghi'
        ) : (
          <>
            Hiển thị <span className="font-medium text-slate-700">{from}–{to}</span> /{' '}
            <span className="font-medium text-slate-700">{total}</span>
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {onSizeChange ? (
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <span className="sr-only">Số dòng mỗi trang</span>
            <select
              value={size}
              disabled={disabled}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-800"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}/trang
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => onPageChange(page - 1)}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Trang trước"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-[4.5rem] px-2 text-center text-xs font-medium text-slate-700">
            {total === 0 ? '0 / 0' : `${page + 1} / ${safeTotalPages}`}
          </span>
          <button
            type="button"
            disabled={!canNext}
            onClick={() => onPageChange(page + 1)}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Trang sau"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_PAGE_SIZE };
