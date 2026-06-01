'use client';

import Link from 'next/link';
import { ChevronRight, Clock, Package, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminBookingRow } from '@/types';
import { ADMIN_PROGRAM, programDetailPath } from '@/features/dashboard/lib/programLabels';
import {
  adminBookingProgressPercent,
  adminBookingStatusBadgeClass,
  adminBookingStatusLabel,
  formatAdminPairLabel,
} from '@/features/admin/lib/adminBookingLabels';

type Props = {
  row: AdminBookingRow;
};

export function AdminProgramCard({ row }: Props) {
  const progress = adminBookingProgressPercent(row.status);

  return (
    <Link
      href={programDetailPath(row.id)}
      className="group block w-full rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
            <Package size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-slate-900">{row.packageTitle}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <Users className="size-3.5 shrink-0" />
              <span className="truncate">{formatAdminPairLabel(row)}</span>
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="size-3.5 shrink-0" />
              <span>
                Mã: <span className="font-mono font-medium text-slate-700">{row.code}</span>
                {' · '}
                {row.scheduledAt}
              </span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4 sm:min-w-[220px] sm:justify-end">
          <div className="min-w-[140px] flex-1 sm:flex-none">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600">{ADMIN_PROGRAM.progress}</span>
              <span className="font-bold text-indigo-600">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {row.amountVnd.toLocaleString('vi-VN')}đ
            </p>
          </div>

          <span
            className={cn(
              'inline-flex rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
              adminBookingStatusBadgeClass(row.status),
            )}
          >
            {adminBookingStatusLabel(row.status)}
          </span>

          <ChevronRight className="size-5 shrink-0 text-slate-300 transition group-hover:text-indigo-500" />
        </div>
      </div>
    </Link>
  );
}
