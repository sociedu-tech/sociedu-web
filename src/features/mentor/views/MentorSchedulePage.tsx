'use client';

import React from 'react';
import { MentorSchedule } from '@/components/dashboard/mentor/MentorSchedule';
import { DashboardViewHeader } from '@/components/dashboard/DashboardPrimitives';

export const MentorSchedulePage = () => {
  return (
    <div className="space-y-6 pb-2">
      <DashboardViewHeader
        eyebrow="Mentor"
        title="Lịch trình & buổi học"
        description="Lịch tháng, buổi sắp tới và khung giờ rảnh — đồng bộ với học viên sau khi nối API."
        layout="compact"
      />
      <MentorSchedule />
    </div>
  );
};
