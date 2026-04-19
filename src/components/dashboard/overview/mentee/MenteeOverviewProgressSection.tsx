'use client';

import Link from 'next/link';
import { StatsChartCard, StatsHorizontalBarChart } from '@/components/dashboard/stats';
import { menteeProjectProgressBars } from '@/components/dashboard/overview/mentee/menteeOverviewData';

export function MenteeOverviewProgressSection() {
  return (
    <StatsChartCard
      title="Tiến độ dự án đang làm"
      chartClassName="space-y-3 px-4 pb-4 pt-1 sm:px-5 sm:pb-5"
    >
      <StatsHorizontalBarChart data={menteeProjectProgressBars} height={260} valueLabel="Tiến độ" />
      <div className="flex flex-wrap justify-end gap-4 border-t border-slate-100 pt-3 text-xs">
        <Link href="/dashboard/projects/progress" className="font-medium text-primary hover:underline">
          Tiến độ chi tiết
        </Link>
        <Link href="/dashboard/projects" className="font-medium text-primary hover:underline">
          Danh sách dự án
        </Link>
      </div>
    </StatsChartCard>
  );
}
