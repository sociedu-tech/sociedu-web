import { api } from '@/lib/api';
import type { User } from '@/types';

const BASE_URL = '/api/v1/users/me';

export const userService = {
  // Profile
  getMe: async (): Promise<User | null> => {
    const res = await api.get(`${BASE_URL}/profile`);
    return res.data as User | null;
  },
  getUserProfile: async (id: string): Promise<User | null> => {
    try {
      const res = await api.get(`/api/v1/users/${id}/profile`);
      return res.data as User | null;
    } catch (error) {
      console.error(`Failed to fetch user profile ${id}, using null fallback:`, error);
      return null;
    }
  },
  updateProfile: async (id: string | number, profileData: any) => {
    const res = await api.put(`${BASE_URL}/profile`, profileData);
    return res.data;
  },

  // Education
  getEducations: async () => {
    try {
      const res = await api.get(`${BASE_URL}/educations`);
      return res.data || [];
    } catch (error) {
      console.error('Failed to fetch educations, using empty fallback:', error);
      return [];
    }
  },
  addEducation: async (data: any) => {
    const res = await api.post(`${BASE_URL}/educations`, data);
    return res.data;
  },
  updateEducation: async (id: number | string, data: any) => {
    const res = await api.put(`${BASE_URL}/educations/${id}`, data);
    return res.data;
  },
  deleteEducation: async (id: number | string) => {
    const res = await api.delete(`${BASE_URL}/educations/${id}`);
    return res.data;
  },

  // Language
  getLanguages: async () => {
    try {
      const res = await api.get(`${BASE_URL}/languages`);
      return res.data || [];
    } catch (error) {
      console.error('Failed to fetch languages, using empty fallback:', error);
      return [];
    }
  },
  addLanguage: async (data: any) => {
    const res = await api.post(`${BASE_URL}/languages`, data);
    return res.data;
  },
  deleteLanguage: async (id: number | string) => {
    const res = await api.delete(`${BASE_URL}/languages/${id}`);
    return res.data;
  },

  // Experience
  getExperiences: async () => {
    try {
      const res = await api.get(`${BASE_URL}/experiences`);
      return res.data || [];
    } catch (error) {
      console.error('Failed to fetch experiences, using empty fallback:', error);
      return [];
    }
  },
  addExperience: async (data: any) => {
    const res = await api.post(`${BASE_URL}/experiences`, data);
    return res.data;
  },
  updateExperience: async (id: number | string, data: any) => {
    const res = await api.put(`${BASE_URL}/experiences/${id}`, data);
    return res.data;
  },
  deleteExperience: async (id: number | string) => {
    const res = await api.delete(`${BASE_URL}/experiences/${id}`);
    return res.data;
  },

  // Certificate
  getCertificates: async () => {
    try {
      const res = await api.get(`${BASE_URL}/certificates`);
      return res.data || [];
    } catch (error) {
      console.error('Failed to fetch certificates, using empty fallback:', error);
      return [];
    }
  },
  addCertificate: async (data: any) => {
    const res = await api.post(`${BASE_URL}/certificates`, data);
    return res.data;
  },
  deleteCertificate: async (id: number | string) => {
    const res = await api.delete(`${BASE_URL}/certificates/${id}`);
    return res.data;
  }
};
