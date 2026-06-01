'use client';

import React from 'react';
import { MentorMentees } from '@/features/dashboard/ui/mentor/MentorMentees';
import { DashboardPage, DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';

export const MentorMenteesPage = () => {
  return (
    <DashboardPage>
      <DashboardViewHeader
        eyebrow="Mentor"
        title="Học viên"
        description="Danh sách học viên đang đồng hành — tìm kiếm, nhắn tin và theo dõi buổi học."
        layout="compact"
      />
      <MentorMentees />
    </DashboardPage>
  );
};
