import { useMemo, useState } from 'react';
import type { AdminUserRow, UserAccountStatus } from '@/types';

export function useAdminUsersManagementView(initialUsers: AdminUserRow[]) {
  const [users, setUsers] = useState<AdminUserRow[]>(initialUsers);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (statusFilter !== 'all' && u.accountStatus !== statusFilter) return false;
      return true;
    });
  }, [users, roleFilter, statusFilter]);

  const setStatus = (id: string, accountStatus: UserAccountStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, accountStatus } : u)));
  };

  const promoteToMentor = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id && u.role === 'user'
          ? {
              ...u,
              role: 'mentor',
              mentorInfo: {
                headline: 'Mentor mới — cập nhật hồ sơ',
                expertise: [],
                price: 0,
                rating: 0,
                sessionsCompleted: 0,
                verificationStatus: 'verified',
              },
            }
          : u,
      ),
    );
  };

  return { users, roleFilter, setRoleFilter, statusFilter, setStatusFilter, filtered, setStatus, promoteToMentor };
}
