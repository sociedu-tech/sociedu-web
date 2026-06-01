import { formatViDateTime, shortId } from '@/lib/apiUtils';
import type { BookingApi, BookingApiSession, BookingProgramItem, DashboardSessionRow } from '@/features/dashboard/types/booking';
import { isRecord } from '@/lib/apiUtils';

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

const readBookingField = (booking: BookingApi, ...keys: string[]): string | null => {
  if (!isRecord(booking)) return null;
  for (const key of keys) {
    const value = booking[key];
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return null;
};

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
        startAt: formatViDateTime(booking.createdAt),
        endAt: 'Đang diễn ra',
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

const UPCOMING_SESSION_LABELS = new Set(['Sắp diễn ra', 'Đang diễn ra']);

/** Buổi sắp tới gần nhất theo scheduledAt (ưu tiên thời điểm >= hiện tại). */
export function pickNextUpcomingSession(sessions: DashboardSessionRow[]): DashboardSessionRow | null {
  const upcoming = sessions.filter((s) => UPCOMING_SESSION_LABELS.has(s.status));
  if (!upcoming.length) return null;

  const bySchedule = [...upcoming].sort((a, b) => {
    const ta = a.scheduledAtIso ? Date.parse(a.scheduledAtIso) : Number.POSITIVE_INFINITY;
    const tb = b.scheduledAtIso ? Date.parse(b.scheduledAtIso) : Number.POSITIVE_INFINITY;
    return ta - tb;
  });

  const now = Date.now();
  const future = bySchedule.find((s) => {
    if (!s.scheduledAtIso) return false;
    const t = Date.parse(s.scheduledAtIso);
    return !Number.isNaN(t) && t >= now;
  });

  return future ?? bySchedule[0] ?? null;
}

const isSessionCompleted = (status?: string | null): boolean => {
  const s = String(status ?? '').toLowerCase();
  return s === 'completed' || s === 'done';
};

const pickMinIso = (dates: (string | null | undefined)[]): string | null => {
  const valid = dates.filter((d): d is string => Boolean(d) && !Number.isNaN(Date.parse(d)));
  if (!valid.length) return null;
  return valid.reduce((min, d) => (Date.parse(d) < Date.parse(min) ? d : min));
};

const pickMaxIso = (dates: (string | null | undefined)[]): string | null => {
  const valid = dates.filter((d): d is string => Boolean(d) && !Number.isNaN(Date.parse(d)));
  if (!valid.length) return null;
  return valid.reduce((max, d) => (Date.parse(d) > Date.parse(max) ? d : max));
};

function computeTeachingTimeRange(
  sessions: BookingApiSession[],
  bookingCreatedAt?: string | null,
): { startAt: string; endAt: string; endAtIsEstimated: boolean } {
  const scheduledDates = sessions.map((s) => s.scheduledAt);
  const startIso = pickMinIso(scheduledDates) ?? bookingCreatedAt ?? null;
  const allDone = sessions.length > 0 && sessions.every((s) => isSessionCompleted(s.status));

  let endIso: string | null;
  let endAtIsEstimated = false;

  if (allDone) {
    endIso = pickMaxIso(sessions.map((s) => s.completedAt ?? s.scheduledAt));
  } else {
    endIso = pickMaxIso(scheduledDates);
    endAtIsEstimated = Boolean(endIso && sessions.length > 0);
  }

  return {
    startAt: startIso ? formatViDateTime(startIso) : '—',
    endAt: endIso
      ? endAtIsEstimated
        ? `${formatViDateTime(endIso)} (dự kiến)`
        : formatViDateTime(endIso)
      : 'Đang diễn ra',
    endAtIsEstimated,
  };
};

export const bookingStatusLabel = (status?: string | null): string => {
  const s = String(status ?? '').toLowerCase();
  if (s === 'completed') return 'Hoàn thành';
  if (s === 'active' || s === 'in_progress') return 'Đang học';
  if (s === 'canceled' || s === 'cancelled') return 'Đã hủy';
  if (s === 'disputed') return 'Tranh chấp';
  return sessionStatusLabel(status);
};

/** Gom booking thành từng chương trình — kèm % buổi đã hoàn thành. */
export function mapBookingsToProgramItems(
  bookings: BookingApi[],
  perspective: 'buyer' | 'mentor',
): BookingProgramItem[] {
  const now = Date.now();
  const counterpartyRoleLabel = perspective === 'mentor' ? 'Học viên' : 'Mentor';

  return bookings
    .map((booking) => {
      const bookingId = String(booking.id ?? '');
      const sessions = booking.sessions ?? [];
      const buyerId = readBookingField(booking, 'buyerId', 'buyer_id');
      const mentorId = readBookingField(booking, 'mentorId', 'mentor_id');
      const counterpartyId = perspective === 'mentor' ? buyerId : mentorId;
      const counterparty = counterpartyLabel(counterpartyId);
      const sessionRows = sessions.length
        ? sessions.map((session) => sessionToRow(bookingId, counterparty, session, perspective, now))
        : flattenBookingsToSessions([booking], perspective);

      const completedSessions = sessions.filter((s) => isSessionCompleted(s.status)).length;
      const totalSessions = sessions.length;
      const progressPercent =
        totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

      const upcoming = sessions
        .filter((s) => !isSessionCompleted(s.status) && String(s.status ?? '').toLowerCase() !== 'canceled')
        .sort((a, b) => Date.parse(a.scheduledAt ?? '') - Date.parse(b.scheduledAt ?? ''))[0];

      const packageId = booking.packageId ? String(booking.packageId) : null;
      const timeRange = computeTeachingTimeRange(sessions, booking.createdAt);

      return {
        bookingId,
        orderId: booking.orderId ? String(booking.orderId) : null,
        packageId,
        packageLabel: 'Gói dịch vụ',
        counterpartyLabel: counterparty,
        buyerId,
        mentorId,
        chatPeerId: counterpartyId,
        counterpartyRoleLabel,
        sessionPerspective: perspective,
        createdAt: formatViDateTime(booking.createdAt ?? undefined),
        bookingStatus: String(booking.status ?? ''),
        bookingStatusLabel: bookingStatusLabel(booking.status),
        totalSessions,
        completedSessions,
        progressPercent,
        sessionRows,
        nextSessionWhen: upcoming?.scheduledAt ? formatViDateTime(upcoming.scheduledAt) : null,
        startAt: timeRange.startAt,
        endAt: timeRange.endAt,
        endAtIsEstimated: timeRange.endAtIsEstimated,
        sortKey: booking.createdAt ?? '',
      };
    })
    .sort((a, b) => Date.parse(b.sortKey) - Date.parse(a.sortKey))
    .map(({ sortKey: _sortKey, ...item }) => item);
}

/** @deprecated Use mapBookingsToProgramItems */
export function mapBookingsToMentorTeachingItems(bookings: BookingApi[]): BookingProgramItem[] {
  return mapBookingsToProgramItems(bookings, 'mentor');
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
    startAt: session.scheduledAt ? formatViDateTime(session.scheduledAt) : '—',
    endAt: session.completedAt ? formatViDateTime(session.completedAt) : '—',
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
