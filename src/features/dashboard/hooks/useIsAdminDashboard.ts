'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';

/** true khi user đang ở dashboard với role admin. */
export function useIsAdminDashboard(): boolean {
  const { userRole } = useAuth();
  return normalizeRole(userRole) === ROLES.ADMIN;
}
