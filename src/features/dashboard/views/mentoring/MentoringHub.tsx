'use client';

import { AuthRoleGate } from '@/components/auth/AuthRoleGate';
import { ROLES, normalizeRole } from '@/constants/roles';
import { useAuth } from '@/context/AuthContext';
import { AdminServicePackagesList } from '@/features/admin/views/AdminServicePackagesList';
import { ProgramList } from '@/features/dashboard/ui/programs/ProgramList';
import {
  MENTOR_PROGRAM,
  USER_PROGRAM,
  programDetailPath,
} from '@/features/dashboard/lib/programLabels';
import { useGoogleOAuthReturnNotice } from '@/features/dashboard/hooks/useGoogleOAuthReturnNotice';

export function MentoringHub() {
  useGoogleOAuthReturnNotice();
  const { userRole } = useAuth();
  const role = normalizeRole(userRole);

  return (
    <AuthRoleGate>
      {role === ROLES.ADMIN ? (
        <AdminServicePackagesList pageLayout />
      ) : role === ROLES.MENTOR ? (
        <ProgramList
          pageLayout
          eyebrow="Mentor"
          perspective="mentor"
          labels={MENTOR_PROGRAM}
          detailPath={programDetailPath}
        />
      ) : (
        <ProgramList
          pageLayout
          eyebrow="Học viên"
          perspective="buyer"
          labels={USER_PROGRAM}
          detailPath={programDetailPath}
        />
      )}
    </AuthRoleGate>
  );
}
