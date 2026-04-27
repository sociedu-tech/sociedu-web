import { api } from '@/lib/api';
import type { AdminUserRow, UserAccountStatus } from '@/types';
import { normalizeRole, ROLES } from '@/constants/roles';

const BASE_URL = '/api/v1/admin';
const USER_MANAGEMENT_URL = '/api/v1/admin/users';

type AdminUserApiRow = {
  userId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  status?: string | null;
  createdAt?: string | null;
  roles?: string[] | null;
};

const roleFromApi = (roles?: string[] | null): AdminUserRow['role'] => {
  const normalized = (roles ?? []).map((r) => normalizeRole(r));
  if (normalized.includes(ROLES.ADMIN)) return 'admin';
  if (normalized.includes(ROLES.MENTOR)) return 'mentor';
  return 'user';
};

const statusFromApi = (status?: string | null): UserAccountStatus => {
  const normalized = normalizeRole(status);
  if (normalized === 'suspended') return 'suspended';
  if (normalized === 'pending') return 'pending';
  return 'active';
};

const joinDateFromApi = (createdAt?: string | null): string => {
  if (!createdAt) return '—';
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return String(createdAt);
  return d.toLocaleDateString('vi-VN');
};

const fullName = (row: AdminUserApiRow): string => {
  const name = [row.lastName, row.firstName].filter(Boolean).join(' ').trim();
  return name || row.email || 'Người dùng';
};

const toAdminUserRow = (row: AdminUserApiRow): AdminUserRow => ({
  id: row.userId,
  name: fullName(row),
  email: row.email,
  avatar: `https://i.pravatar.cc/300?u=${encodeURIComponent(row.userId || row.email || 'user')}`,
  role: roleFromApi(row.roles),
  joinedDate: joinDateFromApi(row.createdAt),
  accountStatus: statusFromApi(row.status),
});

export const adminService = {
  getUsers: async (): Promise<AdminUserRow[]> => {
    const res = await api.get(USER_MANAGEMENT_URL);
    const rows = (res.data as AdminUserApiRow[] | undefined) ?? [];
    return rows.map(toAdminUserRow);
  },
  updateUserRole: async (userId: string, role: 'user' | 'mentor' | 'admin') => {
    const res = await api.patch(`${USER_MANAGEMENT_URL}/${userId}/role`, { role: role.toUpperCase() });
    return toAdminUserRow(res.data as AdminUserApiRow);
  },
  getStats: async () => {
    const res = await api.get(`${BASE_URL}/stats`);
    return res.data;
  },
  getMentorRequests: async () => {
    const res = await api.get(`${BASE_URL}/mentor-requests`);
    return res.data;
  },
  approveMentor: async (id: number | string) => {
    const res = await api.post(`${BASE_URL}/mentor-requests/${id}/approve`, {});
    return res.data;
  },
  getProductRequests: async () => {
    const res = await api.get(`${BASE_URL}/product-requests`);
    return res.data;
  },
  approveProduct: async (id: number | string) => {
    const res = await api.post(`${BASE_URL}/product-requests/${id}/approve`, {});
    return res.data;
  },
  getUpdateRequests: async () => {
    const res = await api.get(`${BASE_URL}/update-requests`);
    return res.data;
  },
  approveUpdate: async (id: number | string) => {
    const res = await api.post(`${BASE_URL}/update-requests/${id}/approve`, {});
    return res.data;
  }
};
