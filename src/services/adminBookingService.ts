import { api } from '@/lib/api';
import type { AdminBookingRow, BookingStatus } from '@/types';
import { formatDisplayDate } from '@/lib/formatDisplayDate';
import { buildPageQuery, normalizePagePayload, type PagePayload } from '@/lib/apiUtils';

type AdminBookingApiRow = {
  id: string;
  code: string;
  learnerName: string;
  learnerId: string;
  mentorName: string;
  mentorId: string;
  scheduledAt: string;
  durationMin: number;
  status: string;
  packageTitle: string;
  amountVnd: number;
  createdAt: string;
};

const toRow = (row: AdminBookingApiRow): AdminBookingRow => ({
  id: row.id,
  code: row.code,
  learnerName: row.learnerName,
  learnerId: row.learnerId,
  mentorName: row.mentorName,
  mentorId: row.mentorId,
  scheduledAt: formatDisplayDate(row.scheduledAt),
  durationMin: row.durationMin,
  status: row.status as BookingStatus,
  packageTitle: row.packageTitle,
  amountVnd: Number(row.amountVnd ?? 0),
  createdAt: formatDisplayDate(row.createdAt),
});

export const adminBookingService = {
  list: async (params?: {
    status?: string;
    q?: string;
    page?: number;
    size?: number;
  }): Promise<PagePayload<AdminBookingRow>> => {
    const res = await api.get(
      `/api/v1/admin/bookings${buildPageQuery({
        page: params?.page,
        size: params?.size,
        extra: {
          status: params?.status && params.status !== 'all' ? params.status : undefined,
          q: params?.q,
        },
      })}`,
    );
    const page = normalizePagePayload<AdminBookingApiRow>(res.data, params?.size);
    return { ...page, items: page.items.map(toRow) };
  },

  getById: async (id: string): Promise<AdminBookingRow> => {
    const res = await api.get(`/api/v1/admin/bookings/${id}`);
    return toRow(res.data as AdminBookingApiRow);
  },
};
