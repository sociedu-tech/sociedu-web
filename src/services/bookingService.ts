import { api } from '@/lib/api';

const BASE = '/api/v1/bookings';

export const bookingService = {
  listAsBuyer: async () => {
    const res = await api.get(`${BASE}/me/buyer`);
    return res.data;
  },
  listAsMentor: async () => {
    const res = await api.get(`${BASE}/me/mentor`);
    return res.data;
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
