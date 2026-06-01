'use client';

import Link from 'next/link';
import { ChevronRight, Clock, Package, User } from 'lucide-react';
import type { BookingProgramItem } from '@/features/dashboard/types/booking';
import type { ProgramLabels } from '@/features/dashboard/lib/programLabels';

type Props = {
  item: BookingProgramItem;
  labels: Pick<
    ProgramLabels,
    'counterparty' | 'progress' | 'sessionsCompleted'
  >;
  detailPath: string;
};

export function ProgramSessionCard({ item, labels, detailPath }: Props) {
  return (
    <Link
      href={detailPath}
      className="group block w-full rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
            <Package size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-slate-900">{item.packageLabel}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <User className="size-3.5 shrink-0" />
              <span className="truncate">
                {labels.counterparty}:{' '}
                <span className="font-medium text-slate-700">{item.counterpartyLabel}</span>
              </span>
            </p>
            <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
              <Clock className="mt-0.5 size-3.5 shrink-0" />
              <span>
                <span className="block">
                  Bắt đầu: <span className="font-medium text-slate-700">{item.startAt}</span>
                </span>
                <span className="block">
                  Kết thúc:{' '}
                  <span className="font-medium text-slate-700">{item.endAt}</span>
                </span>
              </span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4 sm:min-w-[220px] sm:justify-end">
          <div className="min-w-[140px] flex-1 sm:flex-none">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600">{labels.progress}</span>
              <span className="font-bold text-indigo-600">{item.progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {item.completedSessions}/{item.totalSessions || '—'} {labels.sessionsCompleted}
            </p>
          </div>

          <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            {item.bookingStatusLabel}
          </span>

          <ChevronRight className="size-5 shrink-0 text-slate-300 transition group-hover:text-indigo-500" />
        </div>
      </div>
    </Link>
  );
}
