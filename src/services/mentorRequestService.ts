import { api } from '@/lib/api';
import { normalizePagePayload, type PagePayload } from '@/lib/apiUtils';
export type { PagePayload } from '@/lib/apiUtils';

/** DTO matching BE MentorRequestResponse. */
export type MentorRequestStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export type MentorRequestCertificate = {
  name: string;
  issuer?: string | null;
  year?: number | null;
  url?: string | null;
};

export type MentorRequestApplicant = {
  userId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  createdAt?: string | null;
};

export type MentorRequest = {
  id: string;
  userId: string;
  status: MentorRequestStatus;
  headline: string;
  bio: string;
  expertise: string[];
  yearsOfExperience: number;
  hourlyRate: number;
  cvFileId?: string | null;
  cvUrl?: string | null;
  portfolioUrls?: string[] | null;
  certificates?: MentorRequestCertificate[] | null;
  reason?: string | null;
  note?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  resubmitCount: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  applicant?: MentorRequestApplicant | null;
};

/** Body used for both submit and resubmit. */
export type MentorRequestPayload = {
  headline: string;
  bio: string;
  expertise: string[];
  yearsOfExperience: number;
  hourlyRate: number;
  cvFileId?: string | null;
  cvUrl?: string | null;
  portfolioUrls?: string[];
  certificates?: MentorRequestCertificate[];
};

export type AdminMentorRequestListParams = {
  status?: MentorRequestStatus;
  q?: string;
  page?: number;
  size?: number;
};

const USER_BASE = '/api/v1/mentor-requests';
const ADMIN_BASE = '/api/v1/admin/mentor-requests';

const buildQuery = (params?: Record<string, unknown>): string => {
  if (!params) return '';
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
};

/**
 * Mentor-request API client. Methods split between user and admin scope
 * to match the two controllers on the backend.
 */
export const mentorRequestService = {
  submit: async (payload: MentorRequestPayload): Promise<MentorRequest> => {
    const res = await api.post(USER_BASE, payload);
    return res.data as MentorRequest;
  },

  resubmit: async (payload: MentorRequestPayload): Promise<MentorRequest> => {
    const res = await api.post(`${USER_BASE}/me/resubmit`, payload);
    return res.data as MentorRequest;
  },

  getMyCurrent: async (): Promise<MentorRequest | null> => {
    const res = await api.get(`${USER_BASE}/me`);
    return (res.data as MentorRequest | undefined) ?? null;
  },

  adminList: async (
    params?: AdminMentorRequestListParams,
  ): Promise<PagePayload<MentorRequest>> => {
    const res = await api.get(`${ADMIN_BASE}${buildQuery(params)}`);
    return normalizePagePayload<MentorRequest>(res.data, params?.size ?? 20);
  },

  adminGet: async (id: string): Promise<MentorRequest> => {
    const res = await api.get(`${ADMIN_BASE}/${id}`);
    return res.data as MentorRequest;
  },

  adminApprove: async (id: string, note?: string): Promise<MentorRequest> => {
    const res = await api.post(`${ADMIN_BASE}/${id}/actions/approve`, { note });
    return res.data as MentorRequest;
  },

  adminReject: async (id: string, reason: string, note?: string): Promise<MentorRequest> => {
    const res = await api.post(`${ADMIN_BASE}/${id}/actions/reject`, { reason, note });
    return res.data as MentorRequest;
  },
};
