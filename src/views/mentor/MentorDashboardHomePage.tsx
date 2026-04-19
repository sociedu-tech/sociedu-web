'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { MentorOpportunityPipelineSummary } from '@/components/dashboard/mentor/MentorOpportunityPipelineSummary';
import { MentorRevenue, MentorRevenueToolbar } from '@/components/dashboard/mentor/MentorRevenue';
import { MentorOverviewCharts } from '@/components/dashboard/overview/MentorOverviewCharts';
import { DashboardSection } from '@/components/dashboard/DashboardPrimitives';

export function MentorDashboardHomePage() {
  const { user } = useAuth();
  const greeting = user?.fullName?.trim() || 'Mentor';

  return (
    <div className="space-y-8">
      <header className="border-b border-slate-200/90 pb-6">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-slate-500">Tổng quan</p>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Xin chào, {greeting}
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600">
            Doanh thu và hoạt động ở giữa trang; lịch sử giao dịch nằm cuối. Pipeline cơ hội dự án xem nhanh bên dưới.
          </p>
        </div>
      </header>

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
