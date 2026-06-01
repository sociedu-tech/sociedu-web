import { api } from '@/lib/api';
import type {
  AdminModerationReport,
  ModerationReportStatus,
  ModerationTargetType,
} from '@/types';
import { formatDisplayDate } from '@/lib/formatDisplayDate';
import { buildPageQuery, normalizePagePayload, type PagePayload } from '@/lib/apiUtils';
import type { AdminReportSegment } from '@/features/admin/hooks/useAdminModerationReportsView';

type ApiSessionDispute = NonNullable<AdminModerationReport['sessionDispute']>;

type AdminModerationApiRow = {
  id: string;
  createdAt: string;
  reporterName: string;
  reporterId: string;
  targetType: string;
  targetLabel: string;
  category: string;
  summary: string;
  status: string;
  priority: string;
  resolutionNote?: string;
  sessionDispute?: ApiSessionDispute | null;
};

const toStatus = (s: string): ModerationReportStatus => {
  const v = s.toLowerCase();
  if (v === 'in_review' || v === 'under_review') return 'in_review';
  if (v === 'resolved') return 'resolved';
  if (v === 'dismissed' || v === 'rejected') return 'dismissed';
  return 'open';
};

const toTargetType = (t: string): ModerationTargetType => {
  const allowed: ModerationTargetType[] = ['user', 'mentor', 'booking', 'session', 'review'];
  return allowed.includes(t as ModerationTargetType) ? (t as ModerationTargetType) : 'user';
};

const toRow = (row: AdminModerationApiRow): AdminModerationReport => ({
  id: row.id,
  createdAt: formatDisplayDate(row.createdAt),
  reporterName: row.reporterName,
  reporterId: row.reporterId,
  targetType: toTargetType(row.targetType),
  targetLabel: row.targetLabel,
  category: row.category,
  summary: row.summary,
  status: toStatus(row.status),
  priority: (row.priority === 'high' || row.priority === 'low' ? row.priority : 'normal') as
    | 'low'
    | 'normal'
    | 'high',
  resolutionNote: row.resolutionNote,
  sessionDispute: row.sessionDispute ?? undefined,
});

export const adminModerationService = {
  list: async (params?: {
    segment?: AdminReportSegment;
    status?: string;
    page?: number;
    size?: number;
  }): Promise<PagePayload<AdminModerationReport>> => {
    const res = await api.get(
      `/api/v1/admin/moderation/reports${buildPageQuery({
        page: params?.page,
        size: params?.size,
        extra: {
          segment: params?.segment && params.segment !== 'all' ? params.segment : undefined,
          status: params?.status && params.status !== 'all' ? params.status : undefined,
        },
      })}`,
    );
    const page = normalizePagePayload<AdminModerationApiRow>(res.data, params?.size);
    return { ...page, items: page.items.map(toRow) };
  },

  getById: async (id: string): Promise<AdminModerationReport> => {
    const res = await api.get(`/api/v1/admin/moderation/reports/${id}`);
    return toRow(res.data as AdminModerationApiRow);
  },

  resolve: async (
    id: string,
    body: { status: ModerationReportStatus; resolutionNote?: string },
  ): Promise<AdminModerationReport> => {
    const res = await api.put(`/api/v1/admin/moderation/reports/${id}`, body);
    return toRow(res.data as AdminModerationApiRow);
  },
};
