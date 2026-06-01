import type { NotificationItem } from '@/services/notificationService';
import { ROLES, normalizeRole } from '@/constants/roles';
import {
  MENTOR_ORDERS_PATH,
  USER_ORDERS_PATH,
  mentorOrderDetailPath,
  userOrderDetailPath,
} from '@/features/dashboard/lib/orderLabels';
import {
  programDetailPath,
  programReportPath,
  programSessionReportPath,
  programSessionReportReviewPath,
  programSessionReportSubmitPath,
} from '@/features/dashboard/lib/programLabels';

function metaStr(meta: Record<string, unknown>, key: string): string | null {
  const value = meta[key];
  if (value == null) return null;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function resolveOrderUrl(item: NotificationItem, role: string | null): string {
  const meta = (item.metadata ?? {}) as Record<string, unknown>;
  const orderId = metaStr(meta, 'orderId') ?? item.referenceId;
  if (!orderId) {
    return role === ROLES.MENTOR ? MENTOR_ORDERS_PATH : USER_ORDERS_PATH;
  }
  if (role === ROLES.MENTOR) return mentorOrderDetailPath(orderId);
  return userOrderDetailPath(orderId);
}

function resolveBookingUrl(
  meta: Record<string, unknown>,
  referenceId: string | null | undefined,
  referenceType: string | null | undefined,
): string {
  const bookingId =
    metaStr(meta, 'bookingId') ?? (referenceType === 'booking' ? referenceId : null);
  if (bookingId) return programDetailPath(bookingId);
  return '/dashboard/mentoring';
}

function resolveReportRequestUrl(item: NotificationItem): string {
  const meta = (item.metadata ?? {}) as Record<string, unknown>;
  const bookingId = metaStr(meta, 'bookingId');
  const requestId = item.referenceId ?? metaStr(meta, 'requestId');
  const action = metaStr(meta, 'action');

  if (!bookingId || !requestId) return '/dashboard/mentoring';
  if (action === 'review') return programSessionReportReviewPath(bookingId, requestId);
  if (action === 'submit' || action === 'resubmit') {
    return programSessionReportSubmitPath(bookingId, requestId);
  }
  return programSessionReportPath(bookingId, requestId);
}

function resolveModerationUrl(item: NotificationItem, role: string | null): string {
  const meta = (item.metadata ?? {}) as Record<string, unknown>;
  const reportId = item.referenceId ?? metaStr(meta, 'reportId');

  if (role === ROLES.ADMIN) {
    return reportId ? `/dashboard/moderation/all/${reportId}` : '/dashboard/moderation';
  }
  if (role === ROLES.MENTOR) {
    return '/dashboard/reports';
  }

  const bookingId = metaStr(meta, 'bookingId');
  const entityId = metaStr(meta, 'entityId');
  if (bookingId) return programReportPath(bookingId);
  if (entityId) return programReportPath(entityId);
  return '/dashboard/mentoring';
}

function resolveMentorApplicationUrl(role: string | null): string {
  if (role === ROLES.ADMIN) return '/dashboard/mentors/requests';
  if (role === ROLES.MENTOR) return '/dashboard/packages';
  return '/dashboard/profile/edit';
}

/**
 * Compute dashboard URL to navigate to when a notification is clicked.
 * Returns null when no sensible navigation target can be determined.
 */
export function resolveNotificationUrl(item: NotificationItem, userRole?: string): string | null {
  const meta = (item.metadata ?? {}) as Record<string, unknown>;
  const role = userRole ? normalizeRole(userRole) : null;

  switch (item.referenceType) {
    case 'order':
      return resolveOrderUrl(item, role);

    case 'booking':
    case 'booking_session':
      return resolveBookingUrl(meta, item.referenceId, item.referenceType);

    case 'report_request':
      return resolveReportRequestUrl(item);

    case 'mentor_application':
      return resolveMentorApplicationUrl(role);

    case 'moderation_report':
      return resolveModerationUrl(item, role);

    case 'booking_review': {
      const bookingId = metaStr(meta, 'bookingId');
      if (bookingId) return programDetailPath(bookingId);
      return '/dashboard/mentoring';
    }

    default:
      break;
  }

  switch (item.type?.toUpperCase()) {
    case 'ORDER':
      return resolveOrderUrl(item, role);
    case 'BOOKING':
      return resolveBookingUrl(meta, item.referenceId, item.referenceType);
    case 'REPORT_REQUEST':
      return resolveReportRequestUrl(item);
    case 'MENTOR_APPLICATION':
      return resolveMentorApplicationUrl(role);
    case 'MODERATION':
      return resolveModerationUrl(item, role);
    case 'REVIEW': {
      const bookingId = metaStr(meta, 'bookingId');
      if (bookingId) return programDetailPath(bookingId);
      return '/dashboard/mentoring';
    }
    default:
      return null;
  }
}
