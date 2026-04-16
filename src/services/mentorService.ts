import { api } from '@/lib/api';
import { EMPTY_MENTORS, EMPTY_STATS } from '@/mocks/defaultData';
import type { MentorPackage, User } from '@/types';

const BASE_URL = '/api/v1/mentors';

export const mentorService = {
  // Public Mentor Directory
  getAll: async (): Promise<User[]> => {
    try {
      const res = await api.get(BASE_URL);
      return (res.data as User[]) || EMPTY_MENTORS;
    } catch (error) {
      console.error('Failed to fetch mentors, using fallback:', error);
      return EMPTY_MENTORS;
    }
  },
  getProfile: async (id: number | string): Promise<User | null> => {
    try {
      const res = await api.get(`${BASE_URL}/${id}`);
      return res.data as User;
    } catch (error) {
      console.error(`Failed to fetch mentor profile ${id}, using fallback:`, error);
      return null;
    }
  },
  getPackages: async (id: number | string): Promise<MentorPackage[]> => {
    try {
      const res = await api.get(`${BASE_URL}/${id}/packages`);
      return (res.data as MentorPackage[]) || [];
    } catch (error) {
      console.error(`Failed to fetch packages for mentor ${id}, using fallback:`, error);
      return [];
    }
  },

  // Mentor Management (Self)
  updateMyProfile: async (data: any) => {
    const res = await api.put(`${BASE_URL}/me`, data);
    return res.data;
  },
  addPackage: async (data: any) => {
    const res = await api.post(`${BASE_URL}/me/packages`, data);
    return res.data;
  },
  deletePackage: async (pkgId: number | string) => {
    const res = await api.delete(`${BASE_URL}/me/packages/${pkgId}`);
    return res.data;
  },
  getStats: async () => {
    try {
      const res = await api.get(`${BASE_URL}/me/stats`);
      return res.data || EMPTY_STATS;
    } catch (error) {
      console.error('Failed to fetch stats, using fallback:', error);
      return EMPTY_STATS;
    }
  },
  getWithdrawals: async () => {
    try {
      const res = await api.get(`${BASE_URL}/me/withdrawals`);
      return res.data || [];
    } catch (error) {
      console.error('Failed to fetch withdrawals, using fallback:', error);
      return [];
    }
  },
  savePackagesForMentor: async (id: string, packages: any[]) => {
    const res = await api.put(`${BASE_URL}/me/packages`, { packages });
    return res.data;
  }
};
