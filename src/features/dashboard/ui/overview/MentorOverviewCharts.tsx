'use client';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { MentorOverviewChartRows } from '@/features/dashboard/ui/overview/mentor/MentorOverviewChartRows';
import { MentorOverviewKpiStrip } from '@/features/dashboard/ui/overview/mentor/MentorOverviewKpiStrip';
import { useMentorDashboardOverview } from '@/features/dashboard/hooks/useMentorDashboardOverview';

type Props = { hideKpiStrip?: boolean };

/** Tổng quan mentor — KPI + biểu đồ từ API bookings, orders, payouts, báo cáo. */
export function MentorOverviewCharts({ hideKpiStrip = false }: Props) {
  const data = useMentorDashboardOverview();

  if (data.loading) {
    return <LoadingSpinner label="Đang tải tổng quan…" />;
  }

  if (data.error) {
    return <ErrorMessage message={data.error} />;
  }

  return (
    <div className="space-y-6">
      <MentorOverviewKpiStrip hideKpiStrip={hideKpiStrip} kpi={data.kpi} />
      <MentorOverviewChartRows data={data} />
    </div>
  );
}
