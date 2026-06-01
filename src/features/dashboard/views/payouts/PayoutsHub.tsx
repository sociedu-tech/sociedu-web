'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { AuthRoleGate } from '@/components/auth/AuthRoleGate';
import { AdminPayoutDetailPage, AdminPayoutsListPage } from '@/features/admin/views/AdminPayoutPages';
import { MentorPayoutsListPage } from '@/features/mentor/views/MentorPayoutPages';
import { MentorPayoutDetailPage } from '@/features/mentor/views/MentorPayoutDetailPage';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function PayoutsHub() {
  const { userRole } = useAuth();
  const role = normalizeRole(userRole);

  return (
    <AuthRoleGate>
      {role === ROLES.ADMIN ? (
        <AdminPayoutsListPage />
      ) : role === ROLES.MENTOR ? (
        <MentorPayoutsListPage />
      ) : (
        <ErrorMessage message="Chỉ mentor hoặc quản trị viên mới truy cập được trang rút tiền." />
      )}
    </AuthRoleGate>
  );
}

export function PayoutDetailHub() {
  const { userRole } = useAuth();
  const role = normalizeRole(userRole);

  return (
    <AuthRoleGate>
      {role === ROLES.ADMIN ? (
        <AdminPayoutDetailPage />
      ) : role === ROLES.MENTOR ? (
        <MentorPayoutDetailPage />
      ) : (
        <ErrorMessage message="Không có quyền xem yêu cầu rút tiền." />
      )}
    </AuthRoleGate>
  );
}
