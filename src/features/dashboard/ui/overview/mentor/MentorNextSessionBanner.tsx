'use client';

import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import type { MentorNextSession } from '@/features/dashboard/hooks/useMentorDashboardOverview';
import { MENTORING_PATH } from '@/features/dashboard/lib/programLabels';

type Props = { nextSession: MentorNextSession | null };

export function MentorNextSessionBanner({ nextSession }: Props) {
  if (!nextSession) {
    return (
      <div className="dashboard-stat-tile flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">Chưa có buổi dạy sắp tới. Lịch sẽ hiển thị khi học viên đặt buổi học.</p>
        <Link href={MENTORING_PATH} className="shrink-0 text-sm font-medium text-primary hover:underline">
          Xem mentoring
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
          <p className="text-xs font-medium text-gray">Buổi dạy tiếp theo</p>
          <p className="mt-0.5 text-sm font-semibold text-dark">{nextSession.title}</p>
          <p className="mt-0.5 truncate text-xs text-gray">
            {nextSession.when} · {nextSession.mentee}
          </p>
        </div>
      </div>
      <Link
        href={MENTORING_PATH}
        className="shrink-0 text-sm font-medium text-primary hover:underline sm:text-right"
      >
        Xem lịch
      </Link>
    </div>
  );
}
