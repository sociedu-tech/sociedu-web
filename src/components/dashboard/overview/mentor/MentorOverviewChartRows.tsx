'use client';

import {
  StatsAreaChart,
  StatsBarChart,
  StatsChartCard,
  StatsGroupedBarChart,
  StatsLineChart,
} from '@/components/dashboard/stats';
import {
  mentorMenteeGrowthSeries,
  mentorProjectByStatusSeries,
  mentorProjectMonthlyGrouped,
  mentorRevenueByWeekSeries,
  mentorRevenueGrowthSeries,
  mentorSessionsByWeekSeries,
} from '@/components/dashboard/overview/mentor/mentorOverviewData';

export function MentorOverviewChartRows() {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <StatsChartCard title="Tăng trưởng doanh thu" subtitle="Theo tháng (trđ)">
          <StatsAreaChart
            data={mentorRevenueGrowthSeries}
            name="Doanh thu"
            height={260}
            formatTooltipValue={(v) => `${v} trđ`}
          />
        </StatsChartCard>

        <StatsChartCard title="Tăng trưởng học viên">
          <StatsLineChart
            data={mentorMenteeGrowthSeries}
            name="Học viên"
            height={260}
            yAllowDecimals={false}
            dotRadius={4}
          />
        </StatsChartCard>

        <StatsChartCard title="Dự án theo tháng">
          <StatsGroupedBarChart
            data={mentorProjectMonthlyGrouped}
            xKey="label"
            series={[
              { dataKey: 'moMoi', name: 'Mở mới', colorVar: 'var(--color-chart-1)' },
              { dataKey: 'hoanThanh', name: 'Hoàn thành', colorVar: 'var(--color-chart-2)' },
            ]}
            height={260}
          />
        </StatsChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <StatsChartCard title="Doanh thu theo tuần" subtitle="Đơn vị: trđ">
          <StatsAreaChart
            data={mentorRevenueByWeekSeries}
            name="Doanh thu"
            height={280}
            formatTooltipValue={(v) => `${v} trđ`}
          />
        </StatsChartCard>

        <StatsChartCard title="Buổi học theo tuần">
          <StatsBarChart
            data={mentorSessionsByWeekSeries}
            name="Buổi học"
            height={280}
            colorVar="var(--color-chart-line)"
            maxBarSize={40}
            yAllowDecimals={false}
          />
        </StatsChartCard>

        <StatsChartCard title="Dự án theo trạng thái">
          <StatsBarChart
            data={mentorProjectByStatusSeries}
            name="Số dự án"
            height={280}
            xTickAngle={-12}
            xAxisHeight={56}
            tickFontSize={10}
            yAllowDecimals={false}
          />
        </StatsChartCard>
      </div>
    </>
  );
}
