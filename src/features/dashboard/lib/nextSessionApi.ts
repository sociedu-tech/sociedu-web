import { formatViDateTime, isRecord, shortId } from '@/lib/apiUtils';

export type NextUpcomingSessionApi = {
  bookingId: string;
  sessionId: string;
  title: string;
  scheduledAt: string;
  status?: string;
  counterpartyId: string;
  counterpartyName?: string | null;
};

export function parseNextUpcomingSession(payload: unknown): NextUpcomingSessionApi | null {
  if (payload == null) return null;
  if (!isRecord(payload)) return null;
  const bookingId = payload.bookingId != null ? String(payload.bookingId) : '';
  const sessionId = payload.sessionId != null ? String(payload.sessionId) : '';
  const title = payload.title != null ? String(payload.title) : '';
  const scheduledAt = payload.scheduledAt != null ? String(payload.scheduledAt) : '';
  const counterpartyId = payload.counterpartyId != null ? String(payload.counterpartyId) : '';
  if (!bookingId || !sessionId || !scheduledAt) return null;
  return {
    bookingId,
    sessionId,
    title: title || 'Buổi học',
    scheduledAt,
    status: payload.status != null ? String(payload.status) : undefined,
    counterpartyId,
    counterpartyName:
      payload.counterpartyName != null ? String(payload.counterpartyName) : null,
  };
}

export function mapNextSessionForMentee(
  raw: NextUpcomingSessionApi | null,
): { title: string; when: string; mentor: string } | null {
  if (!raw) return null;
  const mentor =
    raw.counterpartyName?.trim() ||
    (raw.counterpartyId ? `Người dùng #${shortId(raw.counterpartyId)}` : '—');
  return {
    title: raw.title,
    when: formatViDateTime(raw.scheduledAt),
    mentor,
  };
}

export function mapNextSessionForMentor(
  raw: NextUpcomingSessionApi | null,
): { title: string; when: string; mentee: string } | null {
  if (!raw) return null;
  const mentee =
    raw.counterpartyName?.trim() ||
    (raw.counterpartyId ? `Người dùng #${shortId(raw.counterpartyId)}` : '—');
  return {
    title: raw.title,
    when: formatViDateTime(raw.scheduledAt),
    mentee,
  };
}
