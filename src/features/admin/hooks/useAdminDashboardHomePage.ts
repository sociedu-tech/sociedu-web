import { useEffect, useMemo, useState } from 'react';
import type { StatsTimeRange, StatsSeriesPoint } from '@/features/dashboard/ui/stats';
import { adminService } from '@/services/adminService';

export type AdminAnalyticsBundle = {
  kpis: {
    liveSessions: number;
    totalBookings: number;
    totalMentors: number;
    newLearners: number;
    pendingPayouts: number;
    openReports: number;
    pendingMentorRequests: number;
  };
  deltas: {
    liveSessions: number;
    totalBookings: number;
    totalMentors: number;
    newLearners: number;
  };
  series: {
    sessions: StatsSeriesPoint[];
    bookings: StatsSeriesPoint[];
    mentors: StatsSeriesPoint[];
    learners: StatsSeriesPoint[];
  };
  bookingMix: { name: string; value: number }[];
};

const emptyAnalytics = (): AdminAnalyticsBundle => ({
  kpis: {
    liveSessions: 0,
    totalBookings: 0,
    totalMentors: 0,
    newLearners: 0,
    pendingPayouts: 0,
    openReports: 0,
    pendingMentorRequests: 0,
  },
  deltas: { liveSessions: 0, totalBookings: 0, totalMentors: 0, newLearners: 0 },
  series: { sessions: [], bookings: [], mentors: [], learners: [] },
  bookingMix: [],
});

function buildAnalytics(stats: Awaited<ReturnType<typeof adminService.getStats>> | null): AdminAnalyticsBundle {
  const mentors = stats?.totalMentors ?? 0;
  const learners = stats?.totalLearners ?? 0;
  const bookings = stats?.totalBookings ?? 0;
  const liveSessions = stats?.liveSessions ?? 0;
  const pendingPayouts = stats?.pendingPayouts ?? 0;
  const openReports = stats?.openReports ?? 0;
  const pendingMentorRequests = stats?.pendingMentorRequests ?? 0;

  return {
    kpis: {
      liveSessions,
      totalBookings: bookings,
      totalMentors: mentors,
      newLearners: learners,
      pendingPayouts,
      openReports,
      pendingMentorRequests,
    },
    deltas: {
      liveSessions: 0,
      totalBookings: 0,
      totalMentors: 0,
      newLearners: 0,
    },
    series: {
      sessions: liveSessions > 0 ? [{ label: 'Đang diễn ra', value: liveSessions }] : [],
      bookings: bookings > 0 ? [{ label: 'Booking', value: bookings }] : [],
      mentors: mentors > 0 ? [{ label: 'Mentor', value: mentors }] : [],
      learners: learners > 0 ? [{ label: 'Học viên', value: learners }] : [],
    },
    bookingMix: [
      { name: 'Mentor', value: mentors },
      { name: 'Học viên', value: learners },
    ].filter((x) => x.value > 0),
  };
}

export function useAdminDashboardHomePage() {
  const [range, setRange] = useState<StatsTimeRange>('30d');
  const [stats, setStats] = useState<Awaited<ReturnType<typeof adminService.getStats>> | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const apiStats = await adminService.getStats().catch(() => null);
        if (!cancelled) setStats(apiStats);
      } catch {
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const analytics = useMemo(() => {
    if (!loaded) return emptyAnalytics();
    return buildAnalytics(stats);
  }, [stats, loaded]);

  const totalUsers = stats?.totalUsers ?? 0;

  return { range, setRange, analytics, totalUsers, loaded };
}
