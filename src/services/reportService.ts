import { api } from '@/lib/api';
import { buildPageQuery, normalizePagePayload, unwrapPage, type PagePayload } from '@/lib/apiUtils';

export interface ProgressReport {
  id: string;
  menteeId?: string;
  mentorId?: string;
  menteeName?: string;
  mentorName?: string;
  title: string;
  content: string;
  attachmentUrl?: string;
  status: 'PENDING' | 'REVIEWED' | 'REJECTED' | string;
  mentorFeedback?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReportRequest {
  mentorId: string;
  title: string;
  content: string;
  attachmentUrl?: string;
}

export interface ReviewReportRequest {
  status: 'PENDING' | 'REVIEWED' | 'REJECTED';
  mentorFeedback: string;
}

const mapReport = (raw: ProgressReport): ProgressReport => ({
  ...raw,
  id: String(raw.id),
});

export const reportService = {
  getMyReports: async (page = 0, size = 20): Promise<PagePayload<ProgressReport>> => {
    const res = await api.get(`/api/v1/mentee/reports${buildPageQuery({ page, size })}`);
    const p = normalizePagePayload<ProgressReport>(res.data, size);
    return { ...p, items: p.items.map(mapReport) };
  },

  submitReport: async (data: CreateReportRequest): Promise<ProgressReport> => {
    const res = await api.post('/api/v1/mentee/reports', data);
    return mapReport(res.data as ProgressReport);
  },

  getAssignedReports: async (page = 0, size = 20): Promise<PagePayload<ProgressReport>> => {
    const res = await api.get(`/api/v1/mentors/me/reports${buildPageQuery({ page, size })}`);
    const p = normalizePagePayload<ProgressReport>(res.data, size);
    return { ...p, items: p.items.map(mapReport) };
  },

  reviewReport: async (id: number | string, data: ReviewReportRequest) => {
    const res = await api.put(`/api/v1/mentors/me/reports/${id}/feedback`, data);
    return mapReport(res.data as ProgressReport);
  },

  listUnified: async (
    role?: 'mentor' | 'mentee',
    page = 0,
    size = 20,
  ): Promise<PagePayload<ProgressReport>> => {
    const res = await api.get(
      `/api/v1/progress-reports/me${buildPageQuery({ page, size, extra: role ? { role } : undefined })}`,
    );
    const p = normalizePagePayload<ProgressReport>(res.data, size);
    return { ...p, items: p.items.map(mapReport) };
  },
};
