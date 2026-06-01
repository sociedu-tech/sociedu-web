'use client';

import {
  StatsBarChart,
  StatsChartCard,
  StatsLineChart,
} from '@/features/dashboard/ui/stats';
import type { StatsSeriesPoint } from '@/features/dashboard/ui/stats';

type Props = {
  sessionsSeries: StatsSeriesPoint[];
  sessionStatusSeries: StatsSeriesPoint[];
};

function EmptyChart({ label }: { label: string }) {
  return (
    <p className="flex h-[220px] items-center justify-center text-sm text-slate-500">{label}</p>
  );
}

export function MenteeOverviewChartGrids({ sessionsSeries, sessionStatusSeries }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <StatsChartCard title="Buổi học">
        {sessionsSeries.some((p) => p.value > 0) ? (
          <StatsBarChart data={sessionsSeries} name="Buổi" height={240} yAllowDecimals={false} maxBarSize={48} />
        ) : (
          <EmptyChart label="Chưa có buổi học từ booking." />
        )}
      </StatsChartCard>

      <StatsChartCard title="Trạng thái buổi học">
        {sessionStatusSeries.some((p) => p.value > 0) ? (
          <StatsLineChart
            data={sessionStatusSeries}
            name="Buổi"
            height={240}
            yAllowDecimals={false}
            dotRadius={4}
          />
        ) : (
          <EmptyChart label="Chưa có dữ liệu buổi học." />
        )}
      </StatsChartCard>
    </div>
  );
}
