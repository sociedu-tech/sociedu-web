'use client';

import React from 'react';
import { MentorMentees } from '@/components/dashboard/mentor/MentorMentees';
import { DashboardViewHeader } from '@/components/dashboard/DashboardPrimitives';

export const MentorMenteesPage = () => {
  return (
    <div className="space-y-6 pb-2">
      <DashboardViewHeader
        eyebrow="Mentor"
        title="Học viên"
        description="Danh sách học viên đang đồng hành — tìm kiếm, nhắn tin và theo dõi buổi học."
        layout="compact"
      />
      <MentorMentees />
    </div>
  );
};
