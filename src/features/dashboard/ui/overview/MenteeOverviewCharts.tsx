'use client';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { MenteeNextSessionBanner } from '@/features/dashboard/ui/overview/mentee/MenteeNextSessionBanner';
import { MenteeOverviewKpiGrid } from '@/features/dashboard/ui/overview/mentee/MenteeOverviewKpiGrid';
import { MenteeOverviewChartGrids } from '@/features/dashboard/ui/overview/mentee/MenteeOverviewChartGrids';
import { MenteeOverviewProgressSection } from '@/features/dashboard/ui/overview/mentee/MenteeOverviewProgressSection';
import { useMenteeDashboardOverview } from '@/features/dashboard/hooks/useMenteeDashboardOverview';

/** Tổng quan học viên — dữ liệu từ bookings & buổi học. */
export function MenteeOverviewCharts() {
  const data = useMenteeDashboardOverview();

  if (data.loading) {
    return <LoadingSpinner label="Đang tải tổng quan…" />;
  }

  if (data.error) {
    return <ErrorMessage message={data.error} />;
  }

  return (
    <div className="space-y-6">
      <MenteeNextSessionBanner nextSession={data.nextSession} />
      <MenteeOverviewKpiGrid kpi={data.kpi} />
      <MenteeOverviewChartGrids
        sessionsSeries={data.sessionsSeries}
        sessionStatusSeries={data.sessionStatusSeries}
      />
      <MenteeOverviewProgressSection sessionProgressBars={data.sessionProgressBars} />
    </div>
  );
}
