'use client';

import {
  StatsBarChart,
  StatsChartCard,
  StatsLineChart,
} from '@/features/dashboard/ui/stats';
import type { StatsSeriesPoint } from '@/features/dashboard/ui/stats';

type Props = {
  sessionsSeries: StatsSeriesPoint[];
  reportsSeries: StatsSeriesPoint[];
};

function EmptyChart({ label }: { label: string }) {
  return (
    <p className="flex h-[220px] items-center justify-center text-sm text-slate-500">{label}</p>
  );
}

export function MenteeOverviewChartGrids({ sessionsSeries, reportsSeries }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <StatsChartCard title="Buổi học">
        {sessionsSeries.some((p) => p.value > 0) ? (
          <StatsBarChart data={sessionsSeries} name="Buổi" height={240} yAllowDecimals={false} maxBarSize={48} />
        ) : (
          <EmptyChart label="Chưa có buổi học từ booking." />
        )}
      </StatsChartCard>

      <StatsChartCard title="Báo cáo tiến độ">
        {reportsSeries.some((p) => p.value > 0) ? (
          <StatsLineChart
            data={reportsSeries}
            name="Báo cáo"
            height={240}
            yAllowDecimals={false}
            dotRadius={4}
          />
        ) : (
          <EmptyChart label="Chưa có báo cáo tiến độ." />
        )}
      </StatsChartCard>
    </div>
  );
}
