import { api } from '@/lib/api';
import { buildPageQuery, normalizePagePayload, type PagePayload } from '@/lib/apiUtils';

const BASE = '/api/v1/bookings';

export const bookingService = {
  listAsBuyer: async (page = 0, size = 20): Promise<PagePayload<unknown>> => {
    const res = await api.get(`${BASE}/me/buyer${buildPageQuery({ page, size })}`);
    return normalizePagePayload(res.data, size);
  },

  listAsMentor: async (page = 0, size = 20): Promise<PagePayload<unknown>> => {
    const res = await api.get(`${BASE}/me/mentor${buildPageQuery({ page, size })}`);
    return normalizePagePayload(res.data, size);
  },

  getById: async (id: number | string) => {
    const res = await api.get(`${BASE}/${id}`);
    return res.data;
  },

  updateSession: async (
    bookingId: number | string,
    sessionId: number | string,
    body: unknown,
  ) => {
    const res = await api.patch(`${BASE}/${bookingId}/sessions/${sessionId}`, body);
    return res.data;
  },

  addSessionEvidence: async (
    bookingId: number | string,
    sessionId: number | string,
    body: unknown,
  ) => {
    const res = await api.post(
      `${BASE}/${bookingId}/sessions/${sessionId}/evidences`,
      body,
    );
    return res.data;
  },
};
