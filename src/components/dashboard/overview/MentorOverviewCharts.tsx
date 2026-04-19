'use client';

import { MentorOverviewChartRows } from '@/components/dashboard/overview/mentor/MentorOverviewChartRows';
import { MentorOverviewKpiStrip } from '@/components/dashboard/overview/mentor/MentorOverviewKpiStrip';

type Props = { hideKpiStrip?: boolean };

/** Tổng quan mentor — KPI + biểu đồ, dữ liệu tách trong `overview/mentor/mentorOverviewData`. */
export function MentorOverviewCharts({ hideKpiStrip = false }: Props) {
  return (
    <div className="space-y-6">
      <MentorOverviewKpiStrip hideKpiStrip={hideKpiStrip} />
      <MentorOverviewChartRows />
    </div>
  );
}
