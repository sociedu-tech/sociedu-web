import { api } from '@/lib/api';
import {
  AddEvidenceRequest,
  MenteeUpdateSessionRequest,
  MentorUpdateSessionRequest,
} from '@/types';

const BASE = '/api/v1/bookings';

export const bookingService = {
  listAsBuyer: async () => {
    // Assuming backend returns a list, can be updated to PageResponse if needed
    const res = await api.get<any[]>(`${BASE}/me/buyer`);
    return res.data!;
  },
  
  listAsMentor: async () => {
    const res = await api.get<any[]>(`${BASE}/me/mentor`);
    return res.data!;
  },
  
  getById: async (id: string) => {
    const res = await api.get<any>(`${BASE}/${id}`);
    return res.data!;
  },
  
  updateSessionAsMentor: async (
    bookingId: string,
    sessionId: string,
    data: MentorUpdateSessionRequest,
  ) => {
    const res = await api.patch<any>(`${BASE}/${bookingId}/sessions/${sessionId}`, data);
    return res.data!;
  },

  updateSessionAsMentee: async (
    bookingId: string,
    sessionId: string,
    data: MenteeUpdateSessionRequest,
  ) => {
    const res = await api.patch<any>(`${BASE}/${bookingId}/sessions/${sessionId}`, data);
    return res.data!;
  },
  
  addSessionEvidence: async (
    bookingId: string,
    sessionId: string,
    data: AddEvidenceRequest,
  ) => {
    const res = await api.post<any>(
      `${BASE}/${bookingId}/sessions/${sessionId}/evidences`,
      data,
    );
    return res.data!;
  },
};
