import { api } from '../lib/api';

const BASE_URL = '/api/v1/payments';

export const paymentService = {
  handleVNPayReturn: async (params: any) => {
    // params should be the query object from the redirect URL
    const queryString = new URLSearchParams(params).toString();
    const res = await api.get(`${BASE_URL}/vnpay/return?${queryString}`);
    return res.data;
  },
  getPaymentStatusByOrderId: async (orderId: number | string) => {
    const res = await api.get(`${BASE_URL}/order/${orderId}`);
    return res.data;
  }
};
