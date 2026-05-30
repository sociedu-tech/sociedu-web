'use client';

import { useEffect, useMemo, useState } from 'react';
import type { StatsSeriesPoint } from '@/features/dashboard/ui/stats';
import { bookingService } from '@/services/bookingService';
import { reportService } from '@/services/reportService';
import { flattenBookingsToSessions } from '@/features/dashboard/lib/bookingMappers';
import type { BookingApi } from '@/features/dashboard/types/booking';

export type MenteeOverviewData = {
  loading: boolean;
  error: string | null;
  nextSession: { title: string; when: string; mentor: string } | null;
  kpi: {
    activeProjects: number;
    upcomingSessions: number;
    reportsSubmitted: number;
    completionPct: number;
  };
  sessionsSeries: StatsSeriesPoint[];
  reportsSeries: StatsSeriesPoint[];
  progressBars: { label: string; pct: number }[];
};

const EMPTY: MenteeOverviewData = {
  loading: true,
  error: null,
  nextSession: null,
  kpi: { activeProjects: 0, upcomingSessions: 0, reportsSubmitted: 0, completionPct: 0 },
  sessionsSeries: [],
  reportsSeries: [],
  progressBars: [],
};

export function useMenteeDashboardOverview(): MenteeOverviewData {
  const [state, setState] = useState<MenteeOverviewData>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const [bookingsPage, reportsPage] = await Promise.all([
          bookingService.listAsBuyer(0, 50),
          reportService.getMyReports(0, 50),
        ]);
        if (cancelled) return;

        const bookings = bookingsPage.items as BookingApi[];
        const reports = reportsPage.items;
        const sessions = flattenBookingsToSessions(bookings, 'buyer');
        const upcoming = sessions.filter((s) => s.status === 'Sắp diễn ra' || s.status === 'Đang diễn ra');

        const next = upcoming[0] ?? sessions[0] ?? null;

        const reviewed = reports.filter((r) => String(r.status).toUpperCase() === 'REVIEWED').length;
        const completionPct =
          reports.length > 0 ? Math.round((reviewed / reports.length) * 100) : 0;

        const progressBars = reports.slice(0, 5).map((r) => ({
          label: r.title,
          pct:
            String(r.status).toUpperCase() === 'REVIEWED'
              ? 100
              : String(r.status).toUpperCase() === 'PENDING'
                ? 40
                : 15,
        }));

        setState({
          loading: false,
          error: null,
          nextSession: next
            ? { title: next.title, when: next.when, mentor: next.counterparty }
            : null,
          kpi: {
            activeProjects: reports.length,
            upcomingSessions: upcoming.length,
            reportsSubmitted: reports.length,
            completionPct,
          },
          sessionsSeries: [{ label: 'Buổi học', value: sessions.length }],
          reportsSeries: [{ label: 'Báo cáo', value: reports.length }],
          progressBars,
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
