'use client';

import React from 'react';
import { MentorSchedule } from '@/features/dashboard/ui/mentor/MentorSchedule';
import { DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { MENTOR_PROGRAM } from '@/features/dashboard/lib/programLabels';

export const MentorSchedulePage = () => {
  return (
    <div className="space-y-6 pb-2">
      <DashboardViewHeader
        eyebrow="Mentor"
        title={MENTOR_PROGRAM.listTitle}
        description={MENTOR_PROGRAM.listDescription}
        layout="compact"
      />
      <MentorSchedule />
    </div>
  );
};
