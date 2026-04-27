import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AdminUserRow, UserAccountStatus } from '@/types';
import { adminService } from '@/services/adminService';

export function useAdminUsersManagementView() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await adminService.getUsers();
      setUsers(rows);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

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

  const promoteToMentor = async (id: string) => {
    setUpdatingRoleId(id);
    setError(null);
    try {
      const updated = await adminService.updateUserRole(id, 'mentor');
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể cấp quyền mentor.');
    } finally {
      setUpdatingRoleId(null);
    }
  };

  return {
    users,
    loading,
    error,
    updatingRoleId,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    filtered,
    setStatus,
    promoteToMentor,
    refresh: fetchUsers,
  };
}
