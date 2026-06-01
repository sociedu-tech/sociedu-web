import { formatViDateTime, shortId } from '@/lib/apiUtils';
import type { BookingApi, BookingApiSession, DashboardSessionRow } from '@/features/dashboard/types/booking';

export const reportStatusLabel = (status?: string | null): string => {
  const s = String(status ?? '').toUpperCase();
  if (s === 'REVIEWED') return 'Đã duyệt';
  if (s === 'REJECTED') return 'Từ chối';
  if (s === 'PENDING') return 'Chờ duyệt';
  return status?.trim() || '—';
};

export const sessionStatusLabel = (status?: string | null): string => {
  const s = String(status ?? '').toUpperCase();
  if (s === 'COMPLETED' || s === 'DONE') return 'Hoàn thành';
  if (s === 'DISPUTED') return 'Tranh chấp';
  if (s === 'AWAITING_CONFIRMATION') return 'Chờ xác nhận';
  if (s === 'CANCELLED' || s === 'CANCELED') return 'Đã hủy';
  if (s === 'IN_PROGRESS' || s === 'ONGOING') return 'Đang diễn ra';
  if (s === 'SCHEDULED' || s === 'CONFIRMED' || s === 'PENDING') return 'Sắp diễn ra';
  return status?.trim() || '—';
};

const counterpartyLabel = (id?: string | null): string =>
  id ? `Người dùng #${shortId(id)}` : '—';

const isFinalStatus = (status?: string | null): boolean => {
  const s = String(status ?? '').toLowerCase();
  return s === 'completed' || s === 'canceled' || s === 'cancelled' || s === 'disputed';
};

export function flattenBookingsToSessions(
  bookings: BookingApi[],
  perspective: 'buyer' | 'mentor',
): DashboardSessionRow[] {
  const rows: DashboardSessionRow[] = [];
  const now = Date.now();

  for (const booking of bookings) {
    const bookingId = String(booking.id ?? '');
    const counterparty =
      perspective === 'buyer'
        ? counterpartyLabel(booking.mentorId)
        : counterpartyLabel(booking.buyerId);

    const sessions = booking.sessions ?? [];
    if (sessions.length === 0) {
      rows.push({
        id: bookingId,
        bookingId,
        sessionId: bookingId,
        title: `Booking #${shortId(bookingId)}`,
        when: formatViDateTime(booking.createdAt),
        scheduledAtIso: booking.createdAt ?? null,
        counterparty,
        status: sessionStatusLabel(booking.status),
        rawStatus: String(booking.status ?? ''),
        menteeCompletionAck: null,
        mentorCompletionAck: null,
        canConfirm: false,
        myAck: null,
      });
      continue;
    }

    for (const session of sessions) {
      rows.push(sessionToRow(bookingId, counterparty, session, perspective, now));
    }
  }

  rows.sort((a, b) => {
    const ta = Date.parse(a.when) || 0;
    const tb = Date.parse(b.when) || 0;
    return tb - ta;
  });

  return rows;
}

function sessionToRow(
  bookingId: string,
  counterparty: string,
  session: BookingApiSession,
  perspective: 'buyer' | 'mentor',
  nowMs: number,
): DashboardSessionRow {
  const sessionId = String(session.id ?? `${bookingId}-session`);
  const scheduledAtIso = session.scheduledAt ?? null;
  const scheduledMs = scheduledAtIso ? Date.parse(scheduledAtIso) : NaN;
  const deadlineReached = !Number.isNaN(scheduledMs) && nowMs >= scheduledMs;
  const rawStatus = String(session.status ?? '');
  const myAck =
    perspective === 'buyer' ? (session.menteeCompletionAck ?? null) : (session.mentorCompletionAck ?? null);
  const canConfirm =
    !isFinalStatus(rawStatus) && deadlineReached && myAck === null && sessionId !== bookingId;

  return {
    id: sessionId,
    bookingId,
    sessionId,
    title: session.title?.trim() || `Buổi học #${shortId(sessionId)}`,
    when: formatViDateTime(session.scheduledAt ?? session.completedAt),
    scheduledAtIso,
    counterparty,
    status: sessionStatusLabel(session.status),
    rawStatus,
    menteeCompletionAck: session.menteeCompletionAck ?? null,
    mentorCompletionAck: session.mentorCompletionAck ?? null,
    canConfirm,
    myAck,
  };
}
