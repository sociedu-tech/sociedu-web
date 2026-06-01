import { MENTORING_PATH, programDetailPath } from '@/features/dashboard/lib/programLabels';
import {
  mentorOrderDetailPath,
  orderStatusLabel,
  userOrderDetailPath,
} from '@/features/dashboard/lib/orderLabels';
import { bookingStatusLabel } from '@/features/dashboard/lib/bookingMappers';
import type { ChatMessageContext } from '@/features/dashboard/chat/types';
import type { BookingApi } from '@/features/dashboard/types/booking';
import type { ServiceOrderDto } from '@/features/dashboard/types/serviceOrder';
import { resolveOrderPackageName } from '@/lib/resolveOrderPackageNames';
import { formatDisplayDate } from '@/lib/formatDisplayDate';
import { bookingService } from '@/services/bookingService';
import { orderService } from '@/services/orderService';

export type MessageContextSummary = {
  title: string;
  subtitle?: string;
  href?: string;
};

const cache = new Map<string, MessageContextSummary>();
const DEFAULT_PACKAGE_LABEL = 'Gói dịch vụ';

const cacheKey = (ctx: ChatMessageContext) => `${ctx.contextType}:${ctx.contextId}`;

const asRecord = (v: unknown): Record<string, unknown> | null =>
  typeof v === 'object' && v !== null && !Array.isArray(v) ? (v as Record<string, unknown>) : null;

const pickStr = (row: Record<string, unknown>, ...keys: string[]): string => {
  for (const key of keys) {
    const v = row[key];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return '';
};

function buildOrderHref(orderId: string, isMentor: boolean): string {
  return isMentor ? mentorOrderDetailPath(orderId) : userOrderDetailPath(orderId);
}

function readOrderPackageName(raw: unknown): string | null {
  const row = asRecord(raw);
  if (!row) return null;
  const name = pickStr(row, 'packageName', 'package_name', 'serviceName', 'service_name');
  return name || null;
}

async function resolvePackageNameFromOrderId(orderId: string | null | undefined): Promise<string> {
  if (!orderId) return DEFAULT_PACKAGE_LABEL;
  const resolved = await resolveOrderPackageName(orderId);
  if (resolved?.trim()) return resolved.trim();
  try {
    const raw = await orderService.getOrderById(orderId);
    const fromApi = readOrderPackageName(raw);
    if (fromApi) return fromApi;
  } catch {
    // fallback below
  }
  return DEFAULT_PACKAGE_LABEL;
}

async function resolvePackageNameFromBooking(booking: BookingApi): Promise<string> {
  const orderId = booking.orderId ? String(booking.orderId) : '';
  if (orderId) {
    return resolvePackageNameFromOrderId(orderId);
  }
  return DEFAULT_PACKAGE_LABEL;
}

async function summarizeOrder(contextId: string, isMentor: boolean): Promise<MessageContextSummary> {
  let subtitle = 'Đơn hàng';
  try {
    const raw = await orderService.getOrderById(contextId);
    const order = raw as ServiceOrderDto;
    subtitle = orderStatusLabel(order.status) || subtitle;
    const direct = order.packageName?.trim() || readOrderPackageName(raw);
    if (direct) {
      return {
        title: direct,
        subtitle,
        href: buildOrderHref(contextId, isMentor),
      };
    }
  } catch {
    // fallback resolver below
  }

  const title = await resolvePackageNameFromOrderId(contextId);
  return {
    title,
    subtitle,
    href: buildOrderHref(contextId, isMentor),
  };
}

async function summarizeBooking(contextId: string): Promise<MessageContextSummary> {
  const raw = await bookingService.getById(contextId);
  const booking = (raw ?? {}) as BookingApi;
  const title = await resolvePackageNameFromBooking({
    ...booking,
    id: booking.id ?? contextId,
  });
  const status = bookingStatusLabel(booking.status);
  return {
    title,
    subtitle: status || 'Lộ trình mentoring',
    href: programDetailPath(contextId),
  };
}

async function summarizeSession(contextId: string, isMentor: boolean): Promise<MessageContextSummary> {
  const lists = isMentor
    ? await bookingService.listAsMentor(0, 100)
    : await bookingService.listAsBuyer(0, 100);

  for (const item of lists.items) {
    const booking = item as BookingApi;
    const session = booking.sessions?.find((s) => String(s.id) === contextId);
    if (!session || !booking.id) continue;

    const title = await resolvePackageNameFromBooking(booking);
    const sessionTitle = session.title?.trim();
    const when = session.scheduledAt ? formatDisplayDate(session.scheduledAt, { empty: '' }) : '';
    const subtitle = [sessionTitle || 'Buổi học', when].filter(Boolean).join(' · ');

    return {
      title,
      subtitle,
      href: programDetailPath(String(booking.id)),
    };
  }

  return {
    title: DEFAULT_PACKAGE_LABEL,
    subtitle: 'Buổi học mentoring',
    href: MENTORING_PATH,
  };
}

export function getCachedMessageContextSummary(
  context: ChatMessageContext,
): MessageContextSummary | undefined {
  return cache.get(cacheKey(context));
}

export async function fetchMessageContextSummary(
  context: ChatMessageContext,
  isMentor: boolean,
): Promise<MessageContextSummary> {
  const key = cacheKey(context);
  const cached = cache.get(key);
  if (cached) return cached;

  let summary: MessageContextSummary;
  switch (context.contextType) {
    case 'order':
      summary = await summarizeOrder(context.contextId, isMentor);
      break;
    case 'booking':
      summary = await summarizeBooking(context.contextId);
      break;
    case 'session':
      summary = await summarizeSession(context.contextId, isMentor);
      break;
    default:
      summary = { title: DEFAULT_PACKAGE_LABEL };
  }

  cache.set(key, summary);
  return summary;
}

export function contextTypeLabel(contextType: ChatMessageContext['contextType']): string {
  switch (contextType) {
    case 'order':
      return 'Đơn hàng';
    case 'booking':
      return 'Mentoring';
    case 'session':
      return 'Buổi học';
    default:
      return 'Liên quan';
  }
}
