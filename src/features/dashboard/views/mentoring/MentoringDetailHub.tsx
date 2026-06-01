'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { AuthRoleGate } from '@/components/auth/AuthRoleGate';
import { AdminProgramDetailPage } from '@/features/admin/views/AdminProgramDetailPage';
import { MentorTeachingDetailPage } from '@/features/mentor/views/MentorTeachingDetailPage';
import { UserProgramDetailPage } from '@/features/user/views/UserProgramDetailPage';
import { useGoogleOAuthReturnNotice } from '@/features/dashboard/hooks/useGoogleOAuthReturnNotice';

export function MentoringDetailHub() {
  useGoogleOAuthReturnNotice();
  const { userRole } = useAuth();
  const role = normalizeRole(userRole);

  return (
    <AuthRoleGate>
      {role === ROLES.ADMIN ? (
        <div className="p-4 sm:p-6">
          <AdminProgramDetailPage />
        </div>
      ) : role === ROLES.MENTOR ? (
        <MentorTeachingDetailPage />
      ) : (
        <UserProgramDetailPage />
      )}
    </AuthRoleGate>
  );
}
