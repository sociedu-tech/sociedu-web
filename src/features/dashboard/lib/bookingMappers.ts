import { formatViDateTime, shortId } from '@/lib/apiUtils';
import type { BookingApi, BookingApiSession, DashboardSessionRow } from '@/features/dashboard/types/booking';

export const sessionStatusLabel = (status?: string | null): string => {
  const s = String(status ?? '').toUpperCase();
  if (s === 'COMPLETED' || s === 'DONE') return 'Hoàn thành';
  if (s === 'CANCELLED' || s === 'CANCELED') return 'Đã hủy';
  if (s === 'IN_PROGRESS' || s === 'ONGOING') return 'Đang diễn ra';
  if (s === 'SCHEDULED' || s === 'CONFIRMED' || s === 'PENDING') return 'Sắp diễn ra';
  return status?.trim() || '—';
};

export const reportStatusLabel = (status?: string | null): string => {
  const s = String(status ?? '').toUpperCase();
  if (s === 'REVIEWED' || s === 'APPROVED') return 'Đã phản hồi';
  if (s === 'REJECTED') return 'Từ chối';
  if (s === 'PENDING' || s === 'SUBMITTED') return 'Chờ phản hồi';
  return status?.trim() || 'Đang làm';
};

const counterpartyLabel = (id?: string | null): string =>
  id ? `Người dùng #${shortId(id)}` : '—';

export function flattenBookingsToSessions(
  bookings: BookingApi[],
  perspective: 'buyer' | 'mentor',
): DashboardSessionRow[] {
  const rows: DashboardSessionRow[] = [];

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
        title: `Booking #${shortId(bookingId)}`,
        when: formatViDateTime(booking.createdAt),
        counterparty,
        status: sessionStatusLabel(booking.status),
      });
      continue;
    }

    for (const session of sessions) {
      rows.push(sessionToRow(bookingId, counterparty, session));
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
): DashboardSessionRow {
  const id = String(session.id ?? `${bookingId}-session`);
  return {
    id,
    bookingId,
    title: session.title?.trim() || `Buổi học #${shortId(id)}`,
    when: formatViDateTime(session.scheduledAt ?? session.completedAt),
    counterparty,
    status: sessionStatusLabel(session.status),
  };
}
