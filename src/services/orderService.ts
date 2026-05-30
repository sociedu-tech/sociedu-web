import { api } from '@/lib/api';
import { buildPageQuery, normalizePagePayload, type PagePayload } from '@/lib/apiUtils';

const BASE_URL = '/api/v1/orders';

export const orderService = {
  /** Checkout — tạo đơn & URL thanh toán VNPay */
  checkout: async (checkoutData: unknown) => {
    const res = await api.post(`${BASE_URL}/checkout`, checkoutData);
    return res.data;
  },
  /** @deprecated dùng `checkout` — giữ tương thích tên cũ */
  createOrder: async (orderData: unknown) => {
    const res = await api.post(`${BASE_URL}/checkout`, orderData);
    return res.data;
  },
  getMyOrders: async (page = 0, size = 20): Promise<PagePayload<unknown>> => {
    const res = await api.get(`${BASE_URL}/me${buildPageQuery({ page, size })}`);
    return normalizePagePayload(res.data, size);
  },
  getOrderById: async (id: number | string) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
  }
};
