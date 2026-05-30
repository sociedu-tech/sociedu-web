'use client';

import Link from 'next/link';
import { StatsChartCard, StatsHorizontalBarChart } from '@/features/dashboard/ui/stats';
type Props = { progressBars: { label: string; pct: number }[] };

export function MenteeOverviewProgressSection({ progressBars }: Props) {
  const chartData = progressBars.map((b) => ({
    name: b.label,
    value: b.pct,
  }));

  return (
    <StatsChartCard
      title="Tiến độ báo cáo gần đây"
      chartClassName="space-y-3 px-4 pb-4 pt-1 sm:px-5 sm:pb-5"
    >
      {chartData.length > 0 ? (
        <StatsHorizontalBarChart data={chartData} height={260} valueLabel="Tiến độ" />
      ) : (
        <p className="py-8 text-center text-sm text-slate-500">Chưa có báo cáo tiến độ.</p>
      )}
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
