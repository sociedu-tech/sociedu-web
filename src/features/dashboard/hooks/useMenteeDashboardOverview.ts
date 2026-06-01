'use client';

import { useEffect, useMemo, useState } from 'react';
import type { StatsSeriesPoint } from '@/features/dashboard/ui/stats';
import { bookingService } from '@/services/bookingService';
import { flattenBookingsToSessions } from '@/features/dashboard/lib/bookingMappers';
import { mapNextSessionForMentee } from '@/features/dashboard/lib/nextSessionApi';
import type { BookingApi } from '@/features/dashboard/types/booking';

export type MenteeOverviewData = {
  loading: boolean;
  error: string | null;
  nextSession: { title: string; when: string; mentor: string } | null;
  kpi: {
    activeBookings: number;
    upcomingSessions: number;
    completedSessions: number;
    completionPct: number;
  };
  sessionsSeries: StatsSeriesPoint[];
  sessionStatusSeries: StatsSeriesPoint[];
  sessionProgressBars: { label: string; pct: number }[];
};

const EMPTY: MenteeOverviewData = {
  loading: true,
  error: null,
  nextSession: null,
  kpi: { activeBookings: 0, upcomingSessions: 0, completedSessions: 0, completionPct: 0 },
  sessionsSeries: [],
  sessionStatusSeries: [],
  sessionProgressBars: [],
};

export function useMenteeDashboardOverview(): MenteeOverviewData {
  const [state, setState] = useState<MenteeOverviewData>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const [bookingsPage, nextSessionRaw] = await Promise.all([
          bookingService.listAsBuyer(0, 50),
          bookingService.getNextSessionAsBuyer(),
        ]);
        if (cancelled) return;

        const bookings = bookingsPage.items as BookingApi[];
        const sessions = flattenBookingsToSessions(bookings, 'buyer');
        const upcoming = sessions.filter((s) => s.status === 'Sắp diễn ra' || s.status === 'Đang diễn ra');
        const completed = sessions.filter((s) => s.status === 'Hoàn thành');

        const nextSession = mapNextSessionForMentee(nextSessionRaw);
        const completionPct =
          sessions.length > 0 ? Math.round((completed.length / sessions.length) * 100) : 0;

        const sessionProgressBars = sessions.slice(0, 5).map((s) => ({
          label: s.title,
          pct: s.status === 'Hoàn thành' ? 100 : s.status === 'Đang diễn ra' ? 60 : 20,
        }));

        const activeBookings = bookings.filter(
          (b) => !['completed', 'canceled', 'cancelled'].includes(String(b.status).toLowerCase()),
        ).length;

        setState({
          loading: false,
          error: null,
          nextSession,
          kpi: {
            activeBookings,
            upcomingSessions: upcoming.length,
            completedSessions: completed.length,
            completionPct,
          },
          sessionsSeries: [{ label: 'Buổi học', value: sessions.length }],
          sessionStatusSeries: [
            { label: 'Sắp tới', value: upcoming.length },
            { label: 'Hoàn thành', value: completed.length },
          ],
          sessionProgressBars,
        });
      } catch (err: unknown) {
        if (!cancelled) {
          setState({
            ...EMPTY,
            loading: false,
            error: err instanceof Error ? err.message : 'Không tải được tổng quan học viên.',
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => state, [state]);
}
