'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { MentorProgramReportPage } from '@/features/mentor/views/MentorProgramReportPage';
import { UserProgramReportPage } from '@/features/user/views/UserProgramReportPage';
import { MENTORING_PATH } from '@/features/dashboard/lib/programLabels';
import Link from 'next/link';

export function MentoringReportHub() {
  const { userRole } = useAuth();
  const role = normalizeRole(userRole);

  if (role === ROLES.MENTOR) {
    return <MentorProgramReportPage />;
  }

  if (role === ROLES.USER) {
    return <UserProgramReportPage />;
  }

  return (
    <div className="space-y-4">
      <ErrorMessage message="Admin không gửi báo cáo từ trang này." />
      <Link href={MENTORING_PATH} className="inline-block text-sm font-semibold text-primary hover:underline">
        Về Mentoring
      </Link>
    </div>
  );
}
