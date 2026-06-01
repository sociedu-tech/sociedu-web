import { api } from '@/lib/api';
import { buildPageQuery, normalizePagePayload, type PagePayload } from '@/lib/apiUtils';

const BASE = '/api/v1';

export type SessionReportRequestStatus = 'PENDING_SUBMISSION' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export type SessionReportRequest = {
  id: string;
  bookingId: string;
  sessionId?: string | null;
  mentorId: string;
  menteeId: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status: SessionReportRequestStatus;
  menteeContent?: string | null;
  menteeAttachmentUrl?: string | null;
  mentorFeedback?: string | null;
  createdAt: string;
  updatedAt: string;
};

const mapItem = (raw: Record<string, unknown>): SessionReportRequest => ({
  id: String(raw.id ?? ''),
  bookingId: String(raw.bookingId ?? ''),
  sessionId: raw.sessionId ? String(raw.sessionId) : null,
  mentorId: String(raw.mentorId ?? ''),
  menteeId: String(raw.menteeId ?? ''),
  title: String(raw.title ?? ''),
  description: raw.description ? String(raw.description) : null,
  dueDate: raw.dueDate ? String(raw.dueDate) : null,
  status: (raw.status as SessionReportRequestStatus) ?? 'PENDING_SUBMISSION',
  menteeContent: raw.menteeContent ? String(raw.menteeContent) : null,
  menteeAttachmentUrl: raw.menteeAttachmentUrl ? String(raw.menteeAttachmentUrl) : null,
  mentorFeedback: raw.mentorFeedback ? String(raw.mentorFeedback) : null,
  createdAt: String(raw.createdAt ?? ''),
  updatedAt: String(raw.updatedAt ?? ''),
});

const unwrapItem = (res: unknown): SessionReportRequest => {
  const data = (res as any)?.data ?? res;
  return mapItem(data as Record<string, unknown>);
};

export const sessionReportService = {
  /** Mentor tạo yêu cầu nộp báo cáo */
  createRequest: async (
    bookingId: string,
    dto: { title: string; description?: string; dueDate?: string; sessionId?: string },
  ): Promise<SessionReportRequest> => {
    const res = await api.post(`${BASE}/bookings/${bookingId}/report-requests`, dto);
    return unwrapItem(res.data);
  },

  /** Lấy danh sách yêu cầu theo booking */
  listForBooking: async (bookingId: string): Promise<SessionReportRequest[]> => {
    const res = await api.get(`${BASE}/bookings/${bookingId}/report-requests`);
    const data = (res.data as any)?.data ?? res.data;
    const list = Array.isArray(data) ? data : [];
    return list.map((item: unknown) => mapItem(item as Record<string, unknown>));
  },

  /** Mentee nộp báo cáo */
  submit: async (
    requestId: string,
    dto: { content: string; attachmentUrl?: string },
  ): Promise<SessionReportRequest> => {
    const res = await api.post(`${BASE}/report-requests/${requestId}/submit`, dto);
    return unwrapItem(res.data);
  },

  /** Mentor duyệt báo cáo */
  review: async (
    requestId: string,
    dto: { status: 'APPROVED' | 'REJECTED'; feedback?: string },
  ): Promise<SessionReportRequest> => {
    const res = await api.post(`${BASE}/report-requests/${requestId}/review`, dto);
    return unwrapItem(res.data);
  },

  /** Mentee xem danh sách yêu cầu của mình */
  listForMentee: async (page = 0, size = 20): Promise<PagePayload<SessionReportRequest>> => {
    const res = await api.get(`${BASE}/report-requests/me/mentee${buildPageQuery({ page, size })}`);
    const payload = normalizePagePayload<Record<string, unknown>>(res.data, size);
    return { ...payload, items: payload.items.map(mapItem) };
  },

  /** Mentor xem danh sách yêu cầu của mình */
  listForMentor: async (page = 0, size = 20): Promise<PagePayload<SessionReportRequest>> => {
    const res = await api.get(`${BASE}/report-requests/me/mentor${buildPageQuery({ page, size })}`);
    const payload = normalizePagePayload<Record<string, unknown>>(res.data, size);
    return { ...payload, items: payload.items.map(mapItem) };
  },
};
