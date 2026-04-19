import type { StatsSeriesPoint } from '@/components/dashboard/stats';

export const menteeOverviewKpi = {
  inProgress: 4,
  sessionsThisMonth: 8,
  pendingItems: 3,
  completed: 5,
} as const;

export const menteeNextSession = {
  label: 'Thứ Tư, 23/04/2026 · 20:00',
  detail: 'Đồ án web — Mentor: Minh Trần',
} as const;

export const menteeStatusDistribution = [
  { name: 'Đang làm', value: 4, key: 'doing' },
  { name: 'Hoàn thành', value: 5, key: 'done' },
  { name: 'Chưa bắt đầu', value: 3, key: 'todo' },
] as const;

export const menteeWeeklyTasks = [
  { week: 'T1', tasksDone: 3 },
  { week: 'T2', tasksDone: 5 },
  { week: 'T3', tasksDone: 4 },
  { week: 'T4', tasksDone: 7 },
  { week: 'T5', tasksDone: 6 },
  { week: 'T6', tasksDone: 8 },
] as const;

export const menteeWeeklySessions = [
  { week: 'T1', buoi: 1 },
  { week: 'T2', buoi: 2 },
  { week: 'T3', buoi: 1 },
  { week: 'T4', buoi: 2 },
  { week: 'T5', buoi: 2 },
  { week: 'T6', buoi: 2 },
] as const;

export const menteeProjectProgress = [
  { name: 'Đồ án web React', pct: 78 },
  { name: 'API Node + DB', pct: 45 },
  { name: 'Báo cáo tốt nghiệp', pct: 92 },
  { name: 'Ứng dụng mobile', pct: 30 },
] as const;

export const menteeSessionsByMonth = [
  { thang: 'T7', soBuoi: 2 },
  { thang: 'T8', soBuoi: 3 },
  { thang: 'T9', soBuoi: 2 },
  { thang: 'T10', soBuoi: 4 },
  { thang: 'T11', soBuoi: 3 },
  { thang: 'T12', soBuoi: 4 },
] as const;

export const menteeReportMix = [
  { name: 'Đã nộp', value: 5, key: 'done' },
  { name: 'Chờ nộp', value: 2, key: 'wait' },
  { name: 'Quá hạn', value: 1, key: 'late' },
] as const;

export const menteeAvgProgressByMonth = [
  { thang: 'T7', pct: 48 },
  { thang: 'T8', pct: 55 },
  { thang: 'T9', pct: 58 },
  { thang: 'T10', pct: 62 },
  { thang: 'T11', pct: 68 },
  { thang: 'T12', pct: 71 },
] as const;

export const menteeStatusDonutData = menteeStatusDistribution.map(({ name, value }) => ({ name, value }));

export const menteeReportDonutData = menteeReportMix.map(({ name, value }) => ({ name, value }));

export const menteeWeeklyTasksSeries: StatsSeriesPoint[] = menteeWeeklyTasks.map((r) => ({
  label: r.week,
  value: r.tasksDone,
}));

export const menteeWeeklySessionsSeries: StatsSeriesPoint[] = menteeWeeklySessions.map((r) => ({
  label: r.week,
  value: r.buoi,
}));

export const menteeSessionsByMonthSeries: StatsSeriesPoint[] = menteeSessionsByMonth.map((r) => ({
  label: r.thang,
  value: r.soBuoi,
}));

export const menteeAvgProgressSeries: StatsSeriesPoint[] = menteeAvgProgressByMonth.map((r) => ({
  label: r.thang,
  value: r.pct,
}));

export const menteeProjectProgressBars = menteeProjectProgress.map((r) => ({ name: r.name, value: r.pct }));
