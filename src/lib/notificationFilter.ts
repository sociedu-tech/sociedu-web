import type { NotificationItem } from '@/services/notificationService';

/** In-app action notifications (orders, bookings, reports, …) — excludes chat. */
export function isActionNotification(item: NotificationItem): boolean {
  const type = item.type?.toUpperCase();
  if (type === 'CHAT') return false;
  if (item.referenceType?.toLowerCase() === 'conversation') return false;
  return true;
}

export function filterActionNotifications(items: NotificationItem[]): NotificationItem[] {
  return items.filter(isActionNotification);
}
