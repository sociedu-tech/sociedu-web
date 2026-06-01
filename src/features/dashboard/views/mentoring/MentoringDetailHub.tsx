'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { AuthRoleGate } from '@/components/auth/AuthRoleGate';
import { AdminProgramDetailPage } from '@/features/admin/views/AdminProgramDetailPage';
import { MentorTeachingDetailPage } from '@/features/mentor/views/MentorTeachingDetailPage';
import { UserProgramDetailPage } from '@/features/user/views/UserProgramDetailPage';
import { GoogleOAuthReturnNotice } from '@/features/dashboard/ui/GoogleOAuthReturnNotice';

export function MentoringDetailHub() {
  const { userRole } = useAuth();
  const role = normalizeRole(userRole);

  return (
    <AuthRoleGate>
      <GoogleOAuthReturnNotice />
      {role === ROLES.ADMIN ? (
        <AdminProgramDetailPage />
      ) : role === ROLES.MENTOR ? (
        <MentorTeachingDetailPage />
      ) : (
        <UserProgramDetailPage />
      )}
    </AuthRoleGate>
  );
}
