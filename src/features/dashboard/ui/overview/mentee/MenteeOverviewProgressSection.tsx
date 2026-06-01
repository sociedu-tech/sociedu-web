'use client';

import Link from 'next/link';
import { StatsChartCard, StatsHorizontalBarChart } from '@/features/dashboard/ui/stats';
import { MENTORING_PATH } from '@/features/dashboard/lib/programLabels';

type Props = { sessionProgressBars: { label: string; pct: number }[] };

export function MenteeOverviewProgressSection({ sessionProgressBars }: Props) {
  const chartData = sessionProgressBars.map((b) => ({
    name: b.label,
    value: b.pct,
  }));

  return (
    <StatsChartCard
      title="Tiến độ buổi học"
      chartClassName="space-y-3 px-4 pb-4 pt-1 sm:px-5 sm:pb-5"
    >
      {chartData.length > 0 ? (
        <StatsHorizontalBarChart data={chartData} height={260} valueLabel="Tiến độ" />
      ) : (
        <p className="py-8 text-center text-sm text-slate-500">Chưa có buổi học.</p>
      )}
      <div className="flex flex-wrap justify-end gap-4 border-t border-slate-100 pt-3 text-xs">
        <Link href={MENTORING_PATH} className="font-medium text-primary hover:underline">
          Xem tất cả buổi học
        </Link>
      </div>
    </StatsChartCard>
  );
}
