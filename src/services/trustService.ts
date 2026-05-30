import { api } from '@/lib/api';
import { buildPageQuery, normalizePagePayload, type PagePayload } from '@/lib/apiUtils';

const BASE = '/api/v1/trust';

export const trustService = {
  createReport: async (body: unknown) => {
    const res = await api.post(`${BASE}/reports`, body);
    return res.data;
  },
  myReports: async (page = 0, size = 20): Promise<PagePayload<unknown>> => {
    const res = await api.get(`${BASE}/reports/me${buildPageQuery({ page, size })}`);
    return normalizePagePayload(res.data, size);
  },
  addReportEvidence: async (reportId: number | string, body: unknown) => {
    const res = await api.post(`${BASE}/reports/${reportId}/evidences`, body);
    return res.data;
  },
  resolveReport: async (reportId: number | string, body: unknown) => {
    const res = await api.put(`${BASE}/reports/${reportId}/resolve`, body);
    return res.data;
  },
  createDispute: async (body: unknown) => {
    const res = await api.post(`${BASE}/disputes`, body);
    return res.data;
  },
  myDisputes: async (page = 0, size = 20): Promise<PagePayload<unknown>> => {
    const res = await api.get(`${BASE}/disputes/me${buildPageQuery({ page, size })}`);
    return normalizePagePayload(res.data, size);
  },
  resolveDispute: async (disputeId: number | string, body: unknown) => {
    const res = await api.put(`${BASE}/disputes/${disputeId}/resolve`, body);
    return res.data;
  },
};
