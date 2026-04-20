import type { StatsSeriesPoint } from '@/features/dashboard/ui/stats';

export const mentorOverviewKpi = {
  activeMentees: 18,
  activeProjects: 11,
  sessionsThisMonth: 42,
  avgRating: 4.8,
} as const;

export const mentorRevenueByWeek = [
  { t: 'Tuần 1', revenueM: 2.4, sessions: 8 },
  { t: 'Tuần 2', revenueM: 3.1, sessions: 10 },
  { t: 'Tuần 3', revenueM: 2.8, sessions: 9 },
  { t: 'Tuần 4', revenueM: 4.2, sessions: 12 },
] as const;

export const mentorProjectByStatus = [
  { status: 'Đang hướng dẫn', count: 6 },
  { status: 'Chờ phản hồi', count: 3 },
  { status: 'Hoàn thành giai đoạn', count: 2 },
] as const;

export const mentorRevenueGrowthMonthly = [
  { thang: 'T7', revenueM: 9.2 },
  { thang: 'T8', revenueM: 10.1 },
  { thang: 'T9', revenueM: 11.4 },
  { thang: 'T10', revenueM: 10.8 },
  { thang: 'T11', revenueM: 13.2 },
  { thang: 'T12', revenueM: 14.6 },
] as const;

export const mentorMenteeGrowthMonthly = [
  { thang: 'T7', hocVien: 11 },
  { thang: 'T8', hocVien: 13 },
  { thang: 'T9', hocVien: 14 },
  { thang: 'T10', hocVien: 16 },
  { thang: 'T11', hocVien: 17 },
  { thang: 'T12', hocVien: 18 },
] as const;

export const mentorProjectMonthly = [
  { thang: 'T7', moMoi: 3, hoanThanh: 2 },
  { thang: 'T8', moMoi: 2, hoanThanh: 1 },
  { thang: 'T9', moMoi: 4, hoanThanh: 3 },
  { thang: 'T10', moMoi: 3, hoanThanh: 2 },
  { thang: 'T11', moMoi: 2, hoanThanh: 4 },
  { thang: 'T12', moMoi: 3, hoanThanh: 2 },
] as const;

export const mentorRevenueGrowthSeries: StatsSeriesPoint[] = mentorRevenueGrowthMonthly.map((r) => ({
  label: r.thang,
  value: r.revenueM,
}));

export const mentorMenteeGrowthSeries: StatsSeriesPoint[] = mentorMenteeGrowthMonthly.map((r) => ({
  label: r.thang,
  value: r.hocVien,
}));

export const mentorProjectMonthlyGrouped = mentorProjectMonthly.map((r) => ({
  label: r.thang,
  moMoi: r.moMoi,
  hoanThanh: r.hoanThanh,
}));

export const mentorRevenueByWeekSeries: StatsSeriesPoint[] = mentorRevenueByWeek.map((r) => ({
  label: r.t,
  value: r.revenueM,
}));

export const mentorSessionsByWeekSeries: StatsSeriesPoint[] = mentorRevenueByWeek.map((r) => ({
  label: r.t,
  value: r.sessions,
}));

export const mentorProjectByStatusSeries: StatsSeriesPoint[] = mentorProjectByStatus.map((r) => ({
  label: r.status,
  value: r.count,
}));
