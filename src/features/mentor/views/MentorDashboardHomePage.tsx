'use client';

import React from 'react';
import { MentorOpportunityPipelineSummary } from '@/features/dashboard/ui/mentor/MentorOpportunityPipelineSummary';
import { MentorRevenue, MentorRevenueToolbar } from '@/features/dashboard/ui/mentor/MentorRevenue';
import { MentorOverviewCharts } from '@/features/dashboard/ui/overview/MentorOverviewCharts';
import { DashboardSection } from '@/features/dashboard/ui/DashboardPrimitives';

export function MentorDashboardHomePage() {
  return (
    <div className="space-y-8 pb-2">
      <MentorOpportunityPipelineSummary />

      <DashboardSection action={<MentorRevenueToolbar />}>
        <MentorRevenue embedded showStatCards showTransactions={false} compactStats={false} />
      </DashboardSection>

      <DashboardSection>
        <MentorOverviewCharts />
      </DashboardSection>

      <DashboardSection>
        <MentorRevenue embedded showStatCards={false} showTransactions showTransactionsHeading={false} />
      </DashboardSection>
    </div>
  );
}
