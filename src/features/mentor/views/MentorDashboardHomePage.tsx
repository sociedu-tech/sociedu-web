'use client';

import React from 'react';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { MentorRevenue, MentorRevenueToolbar } from '@/features/dashboard/ui/mentor/MentorRevenue';
import { MentorOverviewCharts } from '@/features/dashboard/ui/overview/MentorOverviewCharts';
import { MentorNextSessionBanner } from '@/features/dashboard/ui/overview/mentor/MentorNextSessionBanner';
import { useMentorDashboardOverview } from '@/features/dashboard/hooks/useMentorDashboardOverview';
import { DashboardSection } from '@/features/dashboard/ui/DashboardPrimitives';

export function MentorDashboardHomePage() {
  const overview = useMentorDashboardOverview();

  if (overview.loading) {
    return <PageLoadingState label="Đang tải bảng điều khiển…" variant="stats" minHeight="min-h-[50vh]" />;
  }

  if (overview.error) {
    return <ErrorMessage message={overview.error} />;
  }

  return (
    <div className="space-y-8 pb-2">
      <DashboardSection>
        <MentorNextSessionBanner nextSession={overview.nextSession} />
      </DashboardSection>

      <DashboardSection action={<MentorRevenueToolbar />}>
        <MentorRevenue embedded showStatCards showTransactions={false} compactStats={false} />
      </DashboardSection>

      <DashboardSection>
        <MentorOverviewCharts overview={overview} showNextSession={false} />
      </DashboardSection>

      <DashboardSection>
        <MentorRevenue embedded showStatCards={false} showTransactions showTransactionsHeading={false} />
      </DashboardSection>
    </div>
  );
}
