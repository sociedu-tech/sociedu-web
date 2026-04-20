'use client';

import React from 'react';
import { MenteeOverviewCharts } from '@/features/dashboard/ui/overview/MenteeOverviewCharts';

export function UserDashboardHomePage() {
  return (
    <div className="space-y-8 pb-2">
      <MenteeOverviewCharts />
    </div>
  );
}
