'use client';

import React from 'react';
import { DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { USER_PROGRAM, programDetailPath } from '@/features/dashboard/lib/programLabels';
import { ProgramList } from '@/features/dashboard/ui/programs/ProgramList';

export function UserProgramsPage() {
  return (
    <div className="space-y-6 pb-2">
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
    </div>
  );
}
