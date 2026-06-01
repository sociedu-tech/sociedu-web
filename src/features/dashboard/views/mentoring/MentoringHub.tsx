'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { AdminProgramList } from '@/features/admin/views/AdminProgramList';
import { MentorSchedule } from '@/features/dashboard/ui/mentor/MentorSchedule';
import { ProgramList } from '@/features/dashboard/ui/programs/ProgramList';
import {
  ADMIN_PROGRAM,
  MENTORING_NAV,
  MENTOR_PROGRAM,
  USER_PROGRAM,
  programDetailPath,
} from '@/features/dashboard/lib/programLabels';

export function MentoringHub() {
  const { userRole } = useAuth();
  const role = normalizeRole(userRole);

  if (role === ROLES.ADMIN) {
    return (
      <>
        <DashboardViewHeader
          title={ADMIN_PROGRAM.listTitle}
          description={ADMIN_PROGRAM.listDescription}
          layout="compact"
        />
        <DashboardSurface>
          <div className="p-4 sm:p-6">
            <AdminProgramList />
          </div>
        </DashboardSurface>
      </>
    );
  }

  if (role === ROLES.MENTOR) {
    return (
      <div className="space-y-6 pb-2">
        <DashboardViewHeader
          eyebrow="Mentor"
          title={MENTORING_NAV}
          description={MENTOR_PROGRAM.listDescription}
          layout="compact"
        />
        <MentorSchedule />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-2">
      <DashboardViewHeader
        eyebrow="Học viên"
        title={MENTORING_NAV}
        description={USER_PROGRAM.listDescription}
        layout="compact"
      />
      <ProgramList perspective="buyer" labels={USER_PROGRAM} detailPath={programDetailPath} />
    </div>
  );
}
