'use client';

import React from 'react';
import { DashboardPage, DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { MentorMarketplace } from '@/features/mentor/views/MentorMarketplace';

export function UserFindMentorsPage() {
  return (
    <DashboardPage>
      <DashboardViewHeader
        eyebrow="Học tập"
        title="Tìm mentor"
        description="Duyệt danh sách mentor, lọc theo chuyên môn và xem hồ sơ trước khi đặt buổi học."
        layout="compact"
      />
      <MentorMarketplace variant="dashboard" />
    </DashboardPage>
  );
}
