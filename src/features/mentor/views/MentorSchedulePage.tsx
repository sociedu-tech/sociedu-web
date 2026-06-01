'use client';

import React from 'react';
import { MentorSchedule } from '@/features/dashboard/ui/mentor/MentorSchedule';
import { DashboardPage, DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { MENTOR_PROGRAM } from '@/features/dashboard/lib/programLabels';

export const MentorSchedulePage = () => {
  return (
    <DashboardPage>
      <DashboardViewHeader
        eyebrow="Mentor"
        title={MENTOR_PROGRAM.listTitle}
        description={MENTOR_PROGRAM.listDescription}
        layout="compact"
      />
      <MentorSchedule />
    </DashboardPage>
  );
};
