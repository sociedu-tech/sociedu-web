import type { DashboardSessionRow } from '@/features/dashboard/types/booking';
import { normalizeSessionStatus } from '@/features/dashboard/lib/sessionStatusUi';

export type SessionStatRow = { label: string; count: number; tone: string };

const STAT_GROUPS: { label: string; keys: ReturnType<typeof normalizeSessionStatus>[]; tone: string }[] = [
  { label: 'Hoàn thành', keys: ['completed'], tone: 'bg-emerald-500' },
  { label: 'Đang diễn ra / chờ xác nhận', keys: ['in_progress', 'awaiting_confirmation'], tone: 'bg-violet-500' },
  { label: 'Đã lên lịch', keys: ['scheduled'], tone: 'bg-blue-500' },
  { label: 'Chờ xếp lịch', keys: ['pending'], tone: 'bg-slate-400' },
  { label: 'Đã hủy / vắng / tranh chấp', keys: ['canceled', 'cancelled', 'no_show', 'disputed'], tone: 'bg-rose-400' },
];

export function buildSessionStats(sessions: DashboardSessionRow[]): SessionStatRow[] {
  const buckets = new Map<string, number>();
  for (const group of STAT_GROUPS) {
    buckets.set(group.label, 0);
  }

  for (const row of sessions) {
    const key = normalizeSessionStatus(row.rawStatus);
    const group = STAT_GROUPS.find((g) => g.keys.includes(key));
    if (group) {
      buckets.set(group.label, (buckets.get(group.label) ?? 0) + 1);
    }
  }

  return STAT_GROUPS.map((g) => ({
    label: g.label,
    count: buckets.get(g.label) ?? 0,
    tone: g.tone,
  })).filter((row) => row.count > 0);
}
