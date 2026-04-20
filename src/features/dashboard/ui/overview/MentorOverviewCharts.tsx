'use client';

import { MentorOverviewChartRows } from '@/features/dashboard/ui/overview/mentor/MentorOverviewChartRows';
import { MentorOverviewKpiStrip } from '@/features/dashboard/ui/overview/mentor/MentorOverviewKpiStrip';

type Props = { hideKpiStrip?: boolean };

/** Tổng quan mentor — KPI + biểu đồ; dữ liệu mock trong `@/data/mentorOverviewMock`. */
export function MentorOverviewCharts({ hideKpiStrip = false }: Props) {
  return (
    <div className="space-y-6">
      <MentorOverviewKpiStrip hideKpiStrip={hideKpiStrip} />
      <MentorOverviewChartRows />
    </div>
  );
}
