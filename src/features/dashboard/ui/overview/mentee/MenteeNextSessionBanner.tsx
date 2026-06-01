'use client';

import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import type { MenteeOverviewData } from '@/features/dashboard/hooks/useMenteeDashboardOverview';

type Props = { nextSession: MenteeOverviewData['nextSession'] };

export function MenteeNextSessionBanner({ nextSession }: Props) {
  if (!nextSession) {
    return (
      <div className="dashboard-stat-tile flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">Chưa có buổi học sắp tới. Đặt lịch với mentor từ trang Tìm mentor.</p>
        <Link href="/dashboard/find-mentors" className="shrink-0 text-sm font-medium text-primary hover:underline">
          Tìm mentor
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-stat-tile flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
          <CalendarDays className="size-5" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray">Buổi học tiếp theo</p>
          <p className="mt-0.5 text-sm font-semibold text-dark">{nextSession.title}</p>
          <p className="mt-0.5 truncate text-xs text-gray">
            {nextSession.when} · {nextSession.mentor}
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/sessions"
        className="shrink-0 text-sm font-medium text-primary hover:underline sm:text-right"
      >
        Xem lịch
      </Link>
    </div>
  );
}
