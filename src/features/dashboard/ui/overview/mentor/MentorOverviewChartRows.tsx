'use client';

import {
  StatsAreaChart,
  StatsBarChart,
  StatsChartCard,
  StatsGroupedBarChart,
  StatsLineChart,
} from '@/features/dashboard/ui/stats';
import type { MentorOverviewData } from '@/features/dashboard/hooks/useMentorDashboardOverview';
import type { StatsSeriesPoint } from '@/features/dashboard/ui/stats';

type Props = { data: MentorOverviewData };

function EmptyChart({ label }: { label: string }) {
  return (
    <p className="flex h-[260px] items-center justify-center text-sm text-slate-500">{label}</p>
  );
}

export function MentorOverviewChartRows({ data }: Props) {
  const revenueByWeekSeries: StatsSeriesPoint[] = data.revenueByWeek.map((r) => ({
    label: r.t,
    value: r.revenueM,
  }));
  const sessionsByWeekSeries: StatsSeriesPoint[] = data.revenueByWeek.map((r) => ({
    label: r.t,
    value: r.sessions,
  }));
  const projectByStatusSeries: StatsSeriesPoint[] = data.projectByStatus.map((r) => ({
    label: r.status,
    value: r.count,
  }));
  const projectMonthlyGrouped = data.projectMonthly.map((r) => ({
    label: r.thang,
    moMoi: r.moMoi,
    hoanThanh: r.hoanThanh,
  }));

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <StatsChartCard title="Tăng trưởng doanh thu" subtitle="Theo tháng (trđ)">
          {data.revenueGrowthSeries.length > 0 ? (
            <StatsAreaChart
              data={data.revenueGrowthSeries}
              name="Doanh thu"
              height={260}
              formatTooltipValue={(v) => `${v} trđ`}
            />
          ) : (
            <EmptyChart label="Chưa có dữ liệu doanh thu." />
          )}
        </StatsChartCard>

        <StatsChartCard title="Học viên">
          {data.menteeGrowthSeries.length > 0 ? (
            <StatsLineChart
              data={data.menteeGrowthSeries}
              name="Học viên"
              height={260}
              yAllowDecimals={false}
              dotRadius={4}
            />
          ) : (
            <EmptyChart label="Chưa có học viên từ booking." />
          )}
        </StatsChartCard>

        <StatsChartCard title="Báo cáo theo tháng">
          {projectMonthlyGrouped.length > 0 ? (
            <StatsGroupedBarChart
              data={projectMonthlyGrouped}
              xKey="label"
              series={[
                { dataKey: 'moMoi', name: 'Tổng', colorVar: 'var(--color-chart-1)' },
                { dataKey: 'hoanThanh', name: 'Đã phản hồi', colorVar: 'var(--color-chart-2)' },
              ]}
              height={260}
            />
          ) : (
            <EmptyChart label="Chưa có báo cáo tiến độ." />
          )}
        </StatsChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <StatsChartCard title="Doanh thu theo tuần" subtitle="Ước tính từ tổng (trđ)">
          {revenueByWeekSeries.length > 0 ? (
            <StatsAreaChart
              data={revenueByWeekSeries}
              name="Doanh thu"
              height={280}
              formatTooltipValue={(v) => `${v} trđ`}
            />
          ) : (
            <EmptyChart label="Chưa có dữ liệu." />
          )}
        </StatsChartCard>

        <StatsChartCard title="Buổi học theo tuần">
          {sessionsByWeekSeries.length > 0 ? (
            <StatsBarChart
              data={sessionsByWeekSeries}
              name="Buổi học"
              height={280}
              maxBarSize={40}
              yAllowDecimals={false}
            />
          ) : (
            <EmptyChart label="Chưa có buổi học." />
          )}
        </StatsChartCard>

        <StatsChartCard title="Hoạt động theo trạng thái">
          {projectByStatusSeries.length > 0 ? (
            <StatsBarChart
              data={projectByStatusSeries}
              name="Số lượng"
              height={280}
              xTickAngle={-12}
              xAxisHeight={56}
              tickFontSize={10}
              yAllowDecimals={false}
            />
          ) : (
            <EmptyChart label="Chưa có dữ liệu." />
          )}
        </StatsChartCard>
      </div>
    </>
  );
}
