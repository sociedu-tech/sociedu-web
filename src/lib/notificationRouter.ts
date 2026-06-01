import type { NotificationItem } from '@/services/notificationService';
import { ROLES, normalizeRole } from '@/constants/roles';

/**
 * Compute dashboard URL to navigate to when a notification is clicked.
 * Returns null when no sensible navigation target can be determined.
 */
export function resolveNotificationUrl(item: NotificationItem, userRole?: string): string | null {
  const meta = (item.metadata ?? {}) as Record<string, unknown>;
  const role = userRole ? normalizeRole(userRole) : null;

  switch (item.referenceType) {
    /* ---- Order ---- */
    case 'order':
      return role === ROLES.MENTOR ? '/dashboard/orders' : '/dashboard/my-orders';

    /* ---- Booking ---- */
    case 'booking':
    case 'booking_session':
      return '/dashboard/programs';

    /* ---- Mentor application ---- */
    case 'mentor_application':
      return role === ROLES.ADMIN ? '/dashboard/mentor' : '/dashboard/mentor';

    /* ---- Conversation (new chat message) ---- */
    case 'conversation': {
      const convId = meta.conversationId ?? item.referenceId;
      if (convId) {
        return `/dashboard/chat?conversation=${convId}`;
      }
      return '/dashboard/chat';
    }

    /* ---- Moderation Report ---- */
    case 'moderation_report': {
      const reportId = item.referenceId;
      if (role === ROLES.ADMIN) {
        return reportId ? `/dashboard/moderation/all/${reportId}` : '/dashboard/moderation';
      }
      if (role === ROLES.MENTOR) {
        return '/dashboard/reports';
      }
      return '/dashboard/my-reports';
    }

    /* ---- Booking Review ---- */
    case 'booking_review': {
      return '/dashboard/mentoring';
    }

    default:
      break;
  }

  // Fallback: use type field
  if (item.type === 'CHAT') {
    const convId = meta.conversationId;
    if (convId) {
      return `/dashboard/chat?conversation=${convId}`;
    }
    return '/dashboard/chat';
  }
  if (item.type === 'ORDER') {
    return role === ROLES.MENTOR ? '/dashboard/orders' : '/dashboard/my-orders';
  }
  if (item.type === 'BOOKING') {
    return '/dashboard/programs';
  }
  if (item.type === 'MODERATION') {
    const reportId = item.referenceId;
    if (role === ROLES.ADMIN) {
      return reportId ? `/dashboard/moderation/all/${reportId}` : '/dashboard/moderation';
    }
    if (role === ROLES.MENTOR) {
      return '/dashboard/reports';
    }
    return '/dashboard/my-reports';
  }
  if (item.type === 'REVIEW') {
    return '/dashboard/mentoring';
  }

  return null;
}

