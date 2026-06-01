import { api } from '@/lib/api';
import { buildPageQuery, normalizePagePayload, type PagePayload } from '@/lib/apiUtils';
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
  listUsers: async (params?: {
    page?: number;
    size?: number;
    role?: string;
    status?: string;
    q?: string;
  }): Promise<PagePayload<AdminUserRow>> => {
    const res = await api.get(
      `${USER_MANAGEMENT_URL}${buildPageQuery({
        page: params?.page,
        size: params?.size,
        extra: { role: params?.role, status: params?.status, q: params?.q },
      })}`,
    );
    const page = normalizePagePayload<AdminUserApiRow>(res.data, params?.size);
    return { ...page, items: page.items.map(toAdminUserRow) };
  },

  /** @deprecated Dùng listUsers với phân trang */
  getUsers: async (): Promise<AdminUserRow[]> => {
    const page = await adminService.listUsers({ page: 0, size: 100 });
    return page.items;
  },

  updateUserRole: async (userId: string, role: 'user' | 'mentor' | 'admin') => {
    const res = await api.patch(`${USER_MANAGEMENT_URL}/${userId}/role`, { role: role.toUpperCase() });
    return toAdminUserRow(res.data as AdminUserApiRow);
  },

  updateUserStatus: async (userId: string, status: 'active' | 'suspended' | 'pending') => {
    const res = await api.patch(`${USER_MANAGEMENT_URL}/${userId}/status`, { status: status.toLowerCase() });
    return toAdminUserRow(res.data as AdminUserApiRow);
  },

  getStats: async (): Promise<{
    totalUsers: number;
    totalMentors: number;
    totalLearners: number;
    totalBookings: number;
    liveSessions: number;
    pendingMentorRequests: number;
    openReports: number;
  }> => {
    const res = await api.get(`${BASE_URL}/stats`);
    return (
      (res.data as {
        totalUsers: number;
        totalMentors: number;
        totalLearners: number;
        totalBookings: number;
        liveSessions: number;
        pendingMentorRequests: number;
        openReports: number;
      }) ?? {
        totalUsers: 0,
        totalMentors: 0,
        totalLearners: 0,
        totalBookings: 0,
        liveSessions: 0,
        pendingMentorRequests: 0,
        openReports: 0,
      }
    );
  },
};
