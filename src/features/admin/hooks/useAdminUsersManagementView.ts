'use client';

import { useCallback, useState } from 'react';
import type { AdminUserRow, UserAccountStatus } from '@/types';
import { adminService } from '@/services/adminService';
import { usePaginatedList } from '@/hooks/usePaginatedList';

export function useAdminUsersManagementView(defaultRole: string = 'user') {
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState(defaultRole);
  const [statusFilter, setStatusFilter] = useState('all');
  const [localStatus, setLocalStatus] = useState<Record<string, UserAccountStatus>>({});

  const paginated = usePaginatedList<AdminUserRow>({
    fetchPage: useCallback(
      (page, size) =>
        adminService.listUsers({
          page,
          size,
          role: roleFilter === 'all' ? undefined : roleFilter,
          status: statusFilter === 'all' ? undefined : statusFilter,
        }),
      [roleFilter, statusFilter],
    ),
    resetKey: `${roleFilter}-${statusFilter}`,
  });

  const users = paginated.items.map((u) =>
    localStatus[u.id] ? { ...u, accountStatus: localStatus[u.id] } : u,
  );

  const promoteToMentor = async (id: string) => {
    setUpdatingRoleId(id);
    try {
      await adminService.updateUserRole(id, 'mentor');
      await paginated.refresh();
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const setStatus = async (id: string, accountStatus: UserAccountStatus) => {
    setLocalStatus((prev) => ({ ...prev, [id]: accountStatus }));
    try {
      await adminService.updateUserStatus(id, accountStatus);
      await paginated.refresh();
    } catch (err: unknown) {
      console.error('Lỗi khi cập nhật trạng thái người dùng:', err);
      await paginated.refresh();
    }
  };

  return {
    users,
    loading: paginated.loading,
    error: paginated.error,
    updatingRoleId,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    filtered: users,
    setStatus,
    promoteToMentor,
    page: paginated.page,
    size: paginated.size,
    total: paginated.total,
    totalPages: paginated.totalPages,
    setPage: paginated.setPage,
    setSize: paginated.setSize,
    refresh: paginated.refresh,
  };
}
