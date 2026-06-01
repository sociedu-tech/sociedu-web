/** Session status labels + mentor transition options (mirrors backend SessionStatusTransitionPolicy). */

export type SessionStatusKey =
  | 'pending'
  | 'scheduled'
  | 'in_progress'
  | 'awaiting_confirmation'
  | 'completed'
  | 'canceled'
  | 'cancelled'
  | 'disputed'
  | 'no_show';

const NORMALIZE: Record<string, SessionStatusKey> = {
  pending: 'pending',
  scheduled: 'scheduled',
  in_progress: 'in_progress',
  awaiting_confirmation: 'awaiting_confirmation',
  completed: 'completed',
  canceled: 'canceled',
  cancelled: 'cancelled',
  disputed: 'disputed',
  no_show: 'no_show',
};

export function normalizeSessionStatus(raw?: string | null): SessionStatusKey {
  const key = String(raw ?? 'pending').toLowerCase();
  return NORMALIZE[key] ?? 'pending';
}

export const SESSION_STATUS_LABEL: Record<SessionStatusKey, string> = {
  pending: 'Chờ xếp lịch',
  scheduled: 'Đã lên lịch',
  in_progress: 'Đang diễn ra',
  awaiting_confirmation: 'Chờ xác nhận',
  completed: 'Hoàn thành',
  canceled: 'Đã hủy',
  cancelled: 'Đã hủy',
  disputed: 'Tranh chấp',
  no_show: 'Vắng mặt',
};

export const SESSION_STATUS_BADGE: Record<SessionStatusKey, string> = {
  pending: 'bg-slate-100 text-slate-700 ring-slate-200',
  scheduled: 'bg-blue-50 text-blue-800 ring-blue-200',
  in_progress: 'bg-violet-50 text-violet-800 ring-violet-200',
  awaiting_confirmation: 'bg-amber-50 text-amber-900 ring-amber-200',
  completed: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  canceled: 'bg-rose-50 text-rose-800 ring-rose-200',
  cancelled: 'bg-rose-50 text-rose-800 ring-rose-200',
  disputed: 'bg-orange-50 text-orange-900 ring-orange-200',
  no_show: 'bg-zinc-100 text-zinc-700 ring-zinc-200',
};

const MENTOR_TRANSITIONS: Record<SessionStatusKey, SessionStatusKey[]> = {
  pending: ['pending', 'scheduled', 'canceled'],
  scheduled: ['scheduled', 'in_progress', 'awaiting_confirmation', 'completed', 'canceled', 'no_show'],
  in_progress: ['in_progress', 'awaiting_confirmation', 'completed', 'canceled', 'no_show'],
  awaiting_confirmation: ['awaiting_confirmation', 'completed', 'disputed', 'canceled'],
  completed: ['completed'],
  canceled: ['canceled'],
  cancelled: ['cancelled'],
  disputed: ['disputed'],
  no_show: ['no_show'],
};

export function sessionStatusLabel(raw?: string | null): string {
  return SESSION_STATUS_LABEL[normalizeSessionStatus(raw)];
}

export function sessionStatusBadgeClass(raw?: string | null): string {
  return SESSION_STATUS_BADGE[normalizeSessionStatus(raw)];
}

export function mentorSessionStatusOptions(raw?: string | null): { value: string; label: string }[] {
  const current = normalizeSessionStatus(raw);
  const keys = MENTOR_TRANSITIONS[current] ?? [current];
  return keys.map((k) => ({
    value: k === 'cancelled' ? 'canceled' : k,
    label: SESSION_STATUS_LABEL[k],
  }));
}

export function isTerminalSessionStatus(raw?: string | null): boolean {
  const k = normalizeSessionStatus(raw);
  return k === 'completed' || k === 'canceled' || k === 'cancelled' || k === 'disputed' || k === 'no_show';
}
