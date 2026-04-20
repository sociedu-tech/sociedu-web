'use client';

import {
  StatsBarChart,
  StatsChartCard,
  StatsAreaChart,
  StatsDonutChart,
  StatsLineChart,
} from '@/features/dashboard/ui/stats';
import {
  menteeAvgProgressSeries,
  menteeReportDonutData,
  menteeSessionsByMonthSeries,
  menteeStatusDonutData,
  menteeWeeklySessionsSeries,
  menteeWeeklyTasksSeries,
} from '@/data/menteeOverviewMock';

export function MenteeOverviewChartGrids() {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <StatsChartCard title="Trạng thái dự án">
          <StatsDonutChart data={menteeStatusDonutData} height={220} />
        </StatsChartCard>

        <StatsChartCard title="Mục tiêu đã hoàn thành (theo tuần)">
          <StatsAreaChart data={menteeWeeklyTasksSeries} name="Mục tiêu" height={240} />
        </StatsChartCard>

        <StatsChartCard title="Buổi học theo tuần">
          <StatsLineChart
            data={menteeWeeklySessionsSeries}
            name="Buổi học"
            height={240}
            yAllowDecimals={false}
            dotRadius={3}
          />
        </StatsChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <StatsChartCard title="Buổi học theo tháng">
          <StatsBarChart
            data={menteeSessionsByMonthSeries}
            name="Buổi"
            height={240}
            yAllowDecimals={false}
            maxBarSize={36}
          />
        </StatsChartCard>

        <StatsChartCard title="Báo cáo & nhiệm vụ">
          <StatsDonutChart data={menteeReportDonutData} height={220} />
        </StatsChartCard>

        <StatsChartCard title="Tiến độ trung bình dự án">
          <StatsLineChart
            data={menteeAvgProgressSeries}
            name="Tiến độ TB"
            height={240}
            colorVar="var(--color-chart-area-stroke)"
            yDomain={[0, 100]}
            yTickFormatter={(v) => `${v}%`}
            yAllowDecimals={false}
            dotRadius={3}
            formatTooltipValue={(v) => `${v}%`}
          />
        </StatsChartCard>
      </div>
    </>
  );
}
