import { api } from '@/lib/api';

const BASE_URL = '/api/v1/admin';

export const adminService = {
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
