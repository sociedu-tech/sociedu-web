'use client';

import React from 'react';
import { MenteeOverviewCharts } from '@/features/dashboard/ui/overview/MenteeOverviewCharts';
import { DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';

export function UserDashboardHomePage() {
  return (
    <div className="space-y-8 pb-2">
      <DashboardViewHeader
        layout="featured"
        eyebrow="Học viên"
        title="Tổng quan"
        description="Tiến độ dự án, buổi học và việc cần làm — dữ liệu minh họa cho đến khi nối API."
      />
      <MenteeOverviewCharts />
    </div>
  );
}
