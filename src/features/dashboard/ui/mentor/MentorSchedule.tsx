'use client';

import { programDetailPath, MENTOR_PROGRAM } from '@/features/dashboard/lib/programLabels';
import { ProgramList } from '@/features/dashboard/ui/programs/ProgramList';

export function MentorSchedule() {
  return (
    <ProgramList
      perspective="mentor"
      labels={MENTOR_PROGRAM}
      detailPath={programDetailPath}
    />
  );
}
