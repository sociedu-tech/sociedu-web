import { api } from '@/lib/api';

const BASE = '/api/v1/bookings';

export const reviewService = {
  createReview: async (bookingId: string, body: { rating: number; comment?: string }) => {
    const res = await api.post(`${BASE}/${bookingId}/reviews`, body);
    return res.data;
  },
};

