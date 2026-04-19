'use client';

import React from 'react';
import { MenteeOverviewCharts } from '@/components/dashboard/overview/MenteeOverviewCharts';
import { DashboardSection } from '@/components/dashboard/DashboardPrimitives';

export function UserDashboardHomePage() {
  return (
    <DashboardSection title="Tổng quan">
      <MenteeOverviewCharts />
    </DashboardSection>
  );
}
