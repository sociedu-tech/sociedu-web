import type { AdminTimeRange } from '@/components/admin/charts/types';
import type { AdminSeriesPoint } from '@/components/admin/charts/types';

export type AdminAnalyticsKpis = {
  liveSessions: number;
  totalBookings: number;
  totalMentors: number;
  newLearners: number;
};

export type AdminAnalyticsBundle = {
  range: AdminTimeRange;
  kpis: AdminAnalyticsKpis;
  /** % so với kỳ trước (mẫu) */
  deltas: Record<keyof AdminAnalyticsKpis, number>;
  series: {
    sessions: AdminSeriesPoint[];
    bookings: AdminSeriesPoint[];
    mentors: AdminSeriesPoint[];
    learners: AdminSeriesPoint[];
  };
  /** Phân bổ booking theo loại (mẫu) */
  bookingMix: { name: string; value: number }[];
};

function smoothSeries(n: number, seed: number, min: number, max: number): AdminSeriesPoint[] {
  const out: AdminSeriesPoint[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    const wave = Math.sin(seed * 0.3 + t * 4) * 0.25 + 0.75;
    const v = min + (max - min) * t * wave + (i % 3) * (max - min) * 0.02;
    out.push({ label: '', value: Math.round(v) });
  }
  return out;
}

function labelSets(range: AdminTimeRange): { n: number; labels: string[] } {
  switch (range) {
    case '7d':
      return {
        n: 7,
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      };
    case '30d':
      return {
        n: 10,
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5', 'Tuần 6', 'Tuần 7', 'Tuần 8', 'Tuần 9', 'Tuần 10'],
      };
    case '90d':
      return {
        n: 12,
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      };
    case '365d':
    default:
      return {
        n: 12,
        labels: [
          'T1',
          'T2',
          'T3',
          'T4',
          'T5',
          'T6',
          'T7',
          'T8',
          'T9',
          'T10',
          'T11',
          'T12',
        ],
      };
  }
}

/** Dữ liệu mẫu cho dashboard thống kê admin (thay API sau). */
export function getAdminAnalyticsMock(range: AdminTimeRange): AdminAnalyticsBundle {
  const { n, labels } = labelSets(range);

  const mult =
    range === '7d' ? 0.25 : range === '30d' ? 1 : range === '90d' ? 2.8 : 12;

  const kpis: AdminAnalyticsKpis = {
    liveSessions: Math.round(14 + mult * 8 + (range === '7d' ? 6 : 0)),
    totalBookings: Math.round(420 + mult * 120),
    totalMentors: Math.round(48 + mult * 6),
    newLearners: Math.round(180 + mult * 40),
  };

  const deltas: AdminAnalyticsBundle['deltas'] = {
    liveSessions: range === '7d' ? 5.2 : 8.1,
    totalBookings: 12.4,
    totalMentors: 3.8,
    newLearners: 15.6,
  };

  const s1 = smoothSeries(n, 1, 8, 42);
  const s2 = smoothSeries(n, 2, 40, 220);
  const s3 = smoothSeries(n, 3, 2, 18);
  const s4 = smoothSeries(n, 4, 15, 95);

  const applyLabels = (arr: AdminSeriesPoint[]): AdminSeriesPoint[] =>
    arr.map((p, i) => ({ ...p, label: labels[i] ?? `Đ${i + 1}` }));

  return {
    range,
    kpis,
    deltas,
    series: {
      sessions: applyLabels(s1),
      bookings: applyLabels(s2),
      mentors: applyLabels(s3),
      learners: applyLabels(s4),
    },
    bookingMix: [
      { name: 'Buổi 1-1', value: Math.round(38 * mult) },
      { name: 'Gói nhiều buổi', value: Math.round(28 * mult) },
      { name: 'Workshop', value: Math.round(14 * mult) },
      { name: 'Khác', value: Math.round(20 * mult) },
    ],
  };
}
