import { api } from '../lib/api';
import { EMPTY_DOCUMENTS } from '../mocks/defaultData';

const BASE_URL = '/api/v1/documents';

export const documentService = {
  // Public
  getAll: async () => {
    try {
      const res = await api.get(BASE_URL);
      return res.data || EMPTY_DOCUMENTS;
    } catch (error) {
      console.error('Failed to fetch documents, using fallback:', error);
      return EMPTY_DOCUMENTS;
    }
  },
  getById: async (id: number | string) => {
    try {
      const res = await api.get(`${BASE_URL}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Failed to fetch document ${id}, using fallback:`, error);
      return null;
    }
  },

  // Seller
  getMyDocuments: async () => {
    try {
      const res = await api.get(`${BASE_URL}/me`);
      return res.data || [];
    } catch (error) {
      console.error('Failed to fetch my documents, using fallback:', error);
      return [];
    }
  },
  create: async (data: any) => {
    const res = await api.post(BASE_URL, data);
    return res.data;
  },
  update: async (id: number | string, data: any) => {
    const res = await api.put(`${BASE_URL}/${id}`, data);
    return res.data;
  },
  delete: async (id: number | string) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
  },

  // Wishlist
  getWishlist: async () => {
    try {
      const res = await api.get(`${BASE_URL}/wishlist`);
      return res.data || [];
    } catch (error) {
      console.error('Failed to fetch wishlist, using fallback:', error);
      return [];
    }
  },
  addToWishlist: async (id: number | string) => {
    const res = await api.post(`${BASE_URL}/${id}/wishlist`, {});
    return res.data;
  },
  removeFromWishlist: async (id: number | string) => {
    const res = await api.delete(`${BASE_URL}/${id}/wishlist`);
    return res.data;
  }
};
