'use client';

import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { menteeNextSession } from '@/data/menteeOverviewMock';

export function MenteeNextSessionBanner() {
  return (
    <div className="dashboard-stat-tile flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-light text-primary">
          <CalendarDays className="size-5" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray">Buổi học tiếp theo</p>
          <p className="mt-0.5 text-sm font-semibold text-dark">{menteeNextSession.label}</p>
          <p className="mt-0.5 truncate text-xs text-gray">{menteeNextSession.detail}</p>
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
