import { api } from '@/lib/api';
import { buildPageQuery, normalizePagePayload, type PagePayload } from '@/lib/apiUtils';
import type { ServiceOrderDto } from '@/features/dashboard/types/serviceOrder';

const BASE_URL = '/api/v1/orders';

export const orderService = {
  /** Checkout — tạo đơn & URL thanh toán */
  checkout: async (checkoutData: unknown) => {
    const res = await api.post(`${BASE_URL}/checkout`, checkoutData);
    return res.data;
  },
  /** @deprecated dùng `checkout` — giữ tương thích tên cũ */
  createOrder: async (orderData: unknown) => {
    const res = await api.post(`${BASE_URL}/checkout`, orderData);
    return res.data;
  },
  getMyOrders: async (page = 0, size = 20): Promise<PagePayload<ServiceOrderDto>> => {
    const res = await api.get(
      `${BASE_URL}/me${buildPageQuery({ page, size, sort: 'createdAt,desc' })}`,
    );
    return normalizePagePayload<ServiceOrderDto>(res.data, size);
  },
  getOrderById: async (id: number | string) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data as ServiceOrderDto;
  },
  /** Tạo lại URL thanh toán — đơn pending / failed / expired. */
  repayOrder: async (orderId: string) => {
    const res = await api.post(`${BASE_URL}/${orderId}/pay`, {});
    return res.data as ServiceOrderDto;
  },
  /** Incoming orders for mentors */
  getIncomingOrders: async (page = 0, size = 20): Promise<PagePayload<ServiceOrderDto>> => {
    const res = await api.get(
      `${BASE_URL}/me/incoming${buildPageQuery({ page, size, sort: 'createdAt,desc' })}`,
    );
    return normalizePagePayload<ServiceOrderDto>(res.data, size);
  },
};
