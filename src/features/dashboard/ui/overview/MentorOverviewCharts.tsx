'use client';

import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { MentorOverviewChartRows } from '@/features/dashboard/ui/overview/mentor/MentorOverviewChartRows';
import { MentorOverviewKpiStrip } from '@/features/dashboard/ui/overview/mentor/MentorOverviewKpiStrip';
import { MentorNextSessionBanner } from '@/features/dashboard/ui/overview/mentor/MentorNextSessionBanner';
import {
  useMentorDashboardOverview,
  type MentorOverviewData,
} from '@/features/dashboard/hooks/useMentorDashboardOverview';

type ViewProps = {
  hideKpiStrip?: boolean;
  data: MentorOverviewData;
  showNextSession?: boolean;
};

function MentorOverviewChartsView({ hideKpiStrip = false, data, showNextSession = true }: ViewProps) {
  if (data.loading) {
    return <PageLoadingState label="Đang tải tổng quan…" variant="stats" />;
  }

  if (data.error) {
    return <ErrorMessage message={data.error} />;
  }

  return (
    <div className="space-y-6">
      {showNextSession ? <MentorNextSessionBanner nextSession={data.nextSession} /> : null}
      <MentorOverviewKpiStrip hideKpiStrip={hideKpiStrip} kpi={data.kpi} />
      <MentorOverviewChartRows data={data} />
    </div>
  );
}

type Props = {
  hideKpiStrip?: boolean;
  /** Truyền từ trang chủ để tránh gọi API tổng quan hai lần. */
  overview?: MentorOverviewData;
  showNextSession?: boolean;
};

function MentorOverviewChartsWithFetch(props: Omit<Props, 'overview'>) {
  const data = useMentorDashboardOverview();
  return <MentorOverviewChartsView data={data} {...props} />;
}

/** Tổng quan mentor — KPI + biểu đồ từ API bookings, orders, payouts, báo cáo. */
export function MentorOverviewCharts({ overview, ...rest }: Props) {
  if (overview) {
    return <MentorOverviewChartsView data={overview} {...rest} />;
  }
  return <MentorOverviewChartsWithFetch {...rest} />;
}
