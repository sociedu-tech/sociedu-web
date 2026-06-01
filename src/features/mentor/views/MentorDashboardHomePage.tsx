'use client';

import React from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { MentorRevenue, MentorRevenueToolbar } from '@/features/dashboard/ui/mentor/MentorRevenue';
import { MentorOverviewCharts } from '@/features/dashboard/ui/overview/MentorOverviewCharts';
import { MentorNextSessionBanner } from '@/features/dashboard/ui/overview/mentor/MentorNextSessionBanner';
import { useMentorDashboardOverview } from '@/features/dashboard/hooks/useMentorDashboardOverview';
import { DashboardSection } from '@/features/dashboard/ui/DashboardPrimitives';

export function MentorDashboardHomePage() {
  const overview = useMentorDashboardOverview();

  return (
    <div className="space-y-8 pb-2">
      <DashboardSection>
        {overview.loading ? (
          <LoadingSpinner label="Đang tải lịch buổi dạy…" />
        ) : overview.error ? (
          <ErrorMessage message={overview.error} />
        ) : (
          <MentorNextSessionBanner nextSession={overview.nextSession} />
        )}
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
