'use client';

import React from 'react';
import { DashboardPage, DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { USER_PROGRAM, programDetailPath } from '@/features/dashboard/lib/programLabels';
import { ProgramList } from '@/features/dashboard/ui/programs/ProgramList';

export function UserProgramsPage() {
  return (
    <DashboardPage>
      <DashboardViewHeader
        eyebrow="Học viên"
        title={USER_PROGRAM.listTitle}
        description={USER_PROGRAM.listDescription}
        layout="compact"
      />
      <ProgramList
        perspective="buyer"
        labels={USER_PROGRAM}
        detailPath={programDetailPath}
      />
    </DashboardPage>
  );
}
