import { api } from '@/lib/api';
import { normalizePagePayload, type PagePayload } from '@/lib/apiUtils';
import type { PayoutRequestDto } from '@/services/payoutService';

const BASE = '/api/v1/admin/payouts';

export const adminPayoutService = {
  list: async (page = 0, size = 20, status?: string): Promise<PagePayload<PayoutRequestDto>> => {
    const statusQuery = status ? `&status=${encodeURIComponent(status)}` : '';
    const res = await api.get(`${BASE}?page=${page}&size=${size}${statusQuery}`);
    return normalizePagePayload<PayoutRequestDto>(res.data, size);
  },

  getById: async (id: string): Promise<PayoutRequestDto> => {
    const res = await api.get(`${BASE}/${id}`);
    return res.data as PayoutRequestDto;
  },

  approve: async (id: string): Promise<PayoutRequestDto> => {
    const res = await api.post(`${BASE}/${id}/approve`, {});
    return res.data as PayoutRequestDto;
  },

  reject: async (id: string, rejectReason: string): Promise<PayoutRequestDto> => {
    const res = await api.post(`${BASE}/${id}/reject`, { rejectReason });
    return res.data as PayoutRequestDto;
  },

  markPaid: async (id: string, transactionReference: string): Promise<PayoutRequestDto> => {
    const res = await api.post(`${BASE}/${id}/pay`, { transactionReference });
    return res.data as PayoutRequestDto;
  },

  markFailed: async (id: string, failureReason: string): Promise<PayoutRequestDto> => {
    const res = await api.post(`${BASE}/${id}/fail`, { failureReason });
    return res.data as PayoutRequestDto;
  },
};
