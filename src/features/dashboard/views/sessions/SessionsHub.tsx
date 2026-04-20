'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { SessionsListUser } from '@/features/dashboard/views/sessions/SessionsList.user';
import { SessionsListMentor } from '@/features/dashboard/views/sessions/SessionsList.mentor';
import { SessionsListAdmin } from '@/features/dashboard/views/sessions/SessionsList.admin';

export function SessionsHub() {
  const { userRole } = useAuth();
  const r = normalizeRole(userRole);

  const header =
    r === ROLES.ADMIN
      ? {
          eyebrow: 'Quản trị' as const,
          title: 'Buổi học trên hệ thống',
          description: 'Giám sát lịch 1-1 và buổi nhóm (dữ liệu mẫu — nối API sau).',
        }
      : r === ROLES.MENTOR
        ? {
            eyebrow: 'Mentor' as const,
            title: 'Lịch buổi học',
            description: 'Buổi bạn đã nhận, sắp tới và cần xác nhận.',
          }
        : {
            eyebrow: 'Học viên' as const,
            title: 'Buổi học của bạn',
            description: 'Lịch 1-1 và trạng thái buổi với mentor.',
          };

  return (
    <div className="space-y-6 pb-2">
      <DashboardViewHeader {...header} layout="compact" />
      {r === ROLES.ADMIN ? (
        <SessionsListAdmin />
      ) : r === ROLES.MENTOR ? (
        <SessionsListMentor />
      ) : (
        <SessionsListUser />
      )}
    </div>
  );
}
