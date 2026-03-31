import { api } from '../lib/api';

const BASE_URL = '/api/v1/orders';

export const orderService = {
  createOrder: async (orderData: any) => {
    const res = await api.post(BASE_URL, orderData);
    return res.data;
  },
  getMyOrders: async () => {
    const res = await api.get(`${BASE_URL}/me`);
    return res.data;
  },
  getOrderById: async (id: number | string) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
  }
};
