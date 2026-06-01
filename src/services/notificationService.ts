import { api } from '@/lib/api';
import { buildPageQuery, normalizePagePayload, type PagePayload } from '@/lib/apiUtils';

export type NotificationItem = {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: string;
  referenceType?: string | null;
  referenceId?: string | null;
  metadata?: Record<string, unknown> | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
};

type NotificationDto = {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: string;
  referenceType?: string | null;
  referenceId?: string | null;
  metadata?: Record<string, unknown> | null;
  isRead?: boolean;
  readAt?: string | null;
  createdAt: string;
};

const mapItem = (dto: NotificationDto): NotificationItem => ({
  id: String(dto.id),
  userId: String(dto.userId),
  title: dto.title,
  content: dto.content,
  type: dto.type,
  referenceType: dto.referenceType,
  referenceId: dto.referenceId != null ? String(dto.referenceId) : null,
  metadata: dto.metadata ?? null,
  isRead: Boolean(dto.isRead),
  readAt: dto.readAt ?? null,
  createdAt: dto.createdAt,
});

export const notificationService = {
  list: async (page = 0, size = 20): Promise<PagePayload<NotificationItem>> => {
    const res = await api.get(`/api/v1/notifications${buildPageQuery({ page, size })}`);
    const pagePayload = normalizePagePayload<NotificationDto>(res.data, size);
    return { ...pagePayload, items: pagePayload.items.map(mapItem) };
  },

  unreadCount: async (): Promise<number> => {
    const res = await api.get('/api/v1/notifications/unread-count');
    const data = res.data as { unreadCount?: number } | undefined;
    return Number(data?.unreadCount ?? 0);
  },

  markRead: async (id: string): Promise<void> => {
    await api.patch(`/api/v1/notifications/${id}/read`, {});
  },

  markAllRead: async (): Promise<void> => {
    await api.post('/api/v1/notifications/read-all', {});
  },
};
