'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { MentorOpportunityPipelineSummary } from '@/components/dashboard/mentor/MentorOpportunityPipelineSummary';
import { MentorRevenue, MentorRevenueToolbar } from '@/components/dashboard/mentor/MentorRevenue';
import { MentorOverviewCharts } from '@/components/dashboard/overview/MentorOverviewCharts';
import { DashboardSection, DashboardViewHeader } from '@/components/dashboard/DashboardPrimitives';

export function MentorDashboardHomePage() {
  const { user } = useAuth();
  const greeting = user?.fullName?.trim() || 'Mentor';

  return (
    <div className="space-y-8 pb-2">
      <DashboardViewHeader
        layout="featured"
        eyebrow="Mentor"
        title={`Xin chào, ${greeting}`}
        description="Doanh thu và hoạt động ở giữa trang; lịch sử giao dịch ở cuối. Pipeline cơ hội dự án xem nhanh bên dưới."
      />

      <MentorOpportunityPipelineSummary />

      <DashboardSection title="Doanh thu" action={<MentorRevenueToolbar />}>
        <MentorRevenue embedded showStatCards showTransactions={false} compactStats={false} />
      </DashboardSection>

      <DashboardSection title="Hoạt động & xu hướng">
        <MentorOverviewCharts />
      </DashboardSection>

      <DashboardSection title="Lịch sử giao dịch gần đây">
        <MentorRevenue embedded showStatCards={false} showTransactions showTransactionsHeading={false} />
      </DashboardSection>
    </div>
  );
}
