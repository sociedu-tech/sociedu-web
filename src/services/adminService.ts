import { api } from '@/lib/api';
import type { AdminUserRow, UserAccountStatus } from '@/types';

const BASE_URL = '/api/v1/admin';

type AdminUserSummaryResponse = {
  userId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  status: string;
  createdAt?: string | null;
  roles?: string[];
};

const avatar = (seed: string) => `https://i.pravatar.cc/128?u=${encodeURIComponent(seed)}`;

const toAccountStatus = (status?: string): UserAccountStatus => {
  const normalized = status?.toLowerCase();
  if (normalized === 'suspended' || normalized === 'pending') return normalized;
  return 'active';
};

const toUserRole = (roles?: string[]): AdminUserRow['role'] => {
  const normalized = (roles ?? []).map((role) => role.toLowerCase());
  if (normalized.includes('admin')) return 'admin';
  if (normalized.includes('mentor')) return 'mentor';
  return 'user';
};

const formatDate = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('vi-VN').format(date);
};

const toAdminUserRow = (user: AdminUserSummaryResponse): AdminUserRow => {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email;
  const role = toUserRole(user.roles);

  return {
    id: user.userId,
    name,
    email: user.email,
    avatar: avatar(user.email || user.userId),
    role,
    joinedDate: formatDate(user.createdAt),
    accountStatus: toAccountStatus(user.status),
    mentorInfo:
      role === 'mentor'
        ? {
            headline: 'Mentor Sociedu',
            expertise: [],
            price: 0,
            rating: 0,
            sessionsCompleted: 0,
            verificationStatus: user.status?.toLowerCase() === 'pending' ? 'pending' : 'verified',
          }
        : undefined,
  };
};

export const adminService = {
  getUsers: async () => {
    const res = await api.get(`${BASE_URL}/users`);
    return ((res.data as AdminUserSummaryResponse[] | undefined) ?? []).map(toAdminUserRow);
  },
  updateUserRole: async (id: string, role: AdminUserRow['role']) => {
    const apiRole = role === 'admin' ? 'ADMIN' : role === 'mentor' ? 'MENTOR' : 'USER';
    const res = await api.patch(`${BASE_URL}/users/${id}/role`, { role: apiRole });
    return toAdminUserRow(res.data as AdminUserSummaryResponse);
  },
  updateUserStatus: async (id: string, status: UserAccountStatus) => {
    const res = await api.patch(`${BASE_URL}/users/${id}/status`, { status });
    return toAdminUserRow(res.data as AdminUserSummaryResponse);
  },
  getStats: async () => {
    const res = await api.get(`${BASE_URL}/stats`);
    return res.data;
  },
  getMentorRequests: async () => {
    const users = await adminService.getUsers();
    return users.filter((user) => user.role === 'mentor' && user.accountStatus === 'pending');
  },
  approveMentor: async (id: number | string) => {
    return adminService.updateUserStatus(String(id), 'active');
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
