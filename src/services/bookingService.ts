import { api } from '@/lib/api';
import { buildPageQuery, normalizePagePayload, type PagePayload } from '@/lib/apiUtils';
import {
  parseNextUpcomingSession,
  type NextUpcomingSessionApi,
} from '@/features/dashboard/lib/nextSessionApi';
import type { ConfirmSessionCompletionRequest } from '@/features/dashboard/types/booking';

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

  getNextSessionAsBuyer: async (): Promise<NextUpcomingSessionApi | null> => {
    const res = await api.get(`${BASE}/me/buyer/next-session`);
    return parseNextUpcomingSession(res.data);
  },

  getNextSessionAsMentor: async (): Promise<NextUpcomingSessionApi | null> => {
    const res = await api.get(`${BASE}/me/mentor/next-session`);
    return parseNextUpcomingSession(res.data);
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

  confirmSessionCompletion: async (
    bookingId: number | string,
    sessionId: number | string,
    body: ConfirmSessionCompletionRequest,
  ) => {
    const res = await api.post(
      `${BASE}/${bookingId}/sessions/${sessionId}/confirm-completion`,
      body,
    );
    return res.data;
  },
<<<<<<< Updated upstream
=======

  createSession: async (
    bookingId: number | string,
    body: { title: string; description?: string },
  ) => {
    const res = await api.post(`${BASE}/${bookingId}/sessions`, body);
    return res.data;
  },

  cancelBooking: async (bookingId: number | string, reason: string) => {
    const res = await api.post(`${BASE}/${bookingId}/cancel`, { reason });
    return res.data;
  },

  updateProgress: async (bookingId: number | string, progressPercent: number) => {
    const res = await api.patch(`${BASE}/${bookingId}/progress`, { progressPercent });
    return res.data;
  },
>>>>>>> Stashed changes
};
