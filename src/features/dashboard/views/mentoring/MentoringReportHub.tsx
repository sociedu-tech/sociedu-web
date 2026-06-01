'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { AuthRoleGate } from '@/components/auth/AuthRoleGate';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { MentorProgramReportPage } from '@/features/mentor/views/MentorProgramReportPage';
import { UserProgramReportPage } from '@/features/user/views/UserProgramReportPage';
import { MENTORING_PATH } from '@/features/dashboard/lib/programLabels';
import Link from 'next/link';

export function MentoringReportHub() {
  const { userRole } = useAuth();
  const role = normalizeRole(userRole);

  return (
    <AuthRoleGate>
      {role === ROLES.MENTOR ? (
        <MentorProgramReportPage />
      ) : role === ROLES.USER ? (
        <UserProgramReportPage />
      ) : (
        <div className="space-y-4">
          <ErrorMessage message="Admin không gửi báo cáo từ trang này." />
          <Link href={MENTORING_PATH} className="inline-block text-sm font-semibold text-primary hover:underline">
            Về Mentoring
          </Link>
        </div>
      )}
    </AuthRoleGate>
  );
}
