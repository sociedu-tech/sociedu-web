import type { NotificationItem } from '@/services/notificationService';

/** Chuẩn hóa payload notification (REST / WebSocket) về cùng một shape. */
export function normalizeNotificationItem(raw: Record<string, unknown>): NotificationItem {
  const metadata = raw.metadata;
  return {
    id: String(raw.id ?? ''),
    userId: String(raw.userId ?? ''),
    title: String(raw.title ?? ''),
    content: String(raw.content ?? ''),
    type: String(raw.type ?? ''),
    referenceType: raw.referenceType != null ? String(raw.referenceType) : null,
    referenceId: raw.referenceId != null ? String(raw.referenceId) : null,
    metadata:
      metadata && typeof metadata === 'object' && !Array.isArray(metadata)
        ? (metadata as Record<string, unknown>)
        : null,
    isRead: Boolean(raw.isRead),
    readAt: raw.readAt != null ? String(raw.readAt) : null,
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
  };
}
