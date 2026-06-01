'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { AdminProgramDetailPage } from '@/features/admin/views/AdminProgramDetailPage';
import { MentorTeachingDetailPage } from '@/features/mentor/views/MentorTeachingDetailPage';
import { UserProgramDetailPage } from '@/features/user/views/UserProgramDetailPage';

export function MentoringDetailHub() {
  const { userRole } = useAuth();
  const role = normalizeRole(userRole);

  if (role === ROLES.ADMIN) {
    return (
      <div className="p-4 sm:p-6">
        <AdminProgramDetailPage />
      </div>
    );
  }

  if (role === ROLES.MENTOR) {
    return <MentorTeachingDetailPage />;
  }

  return <UserProgramDetailPage />;
}
