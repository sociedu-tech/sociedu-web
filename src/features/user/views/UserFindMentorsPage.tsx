'use client';

import React from 'react';
import { DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { MentorMarketplace } from '@/features/mentor/views/MentorMarketplace';

export function UserFindMentorsPage() {
  return (
    <div className="space-y-6 pb-2">
      <DashboardViewHeader
        eyebrow="Học tập"
        title="Tìm mentor"
        description="Duyệt danh sách mentor, lọc theo chuyên môn và xem hồ sơ trước khi đặt buổi học."
        layout="compact"
      />
      <MentorMarketplace variant="dashboard" />
    </div>
  );
}
