'use client';

import React from 'react';
import { DashboardPage } from '@/features/dashboard/ui/DashboardPrimitives';
import { MenteeOverviewCharts } from '@/features/dashboard/ui/overview/MenteeOverviewCharts';

export function UserDashboardHomePage() {
  return (
    <DashboardPage className="space-y-8 pb-2">
      <MenteeOverviewCharts />
    </DashboardPage>
  );
}
