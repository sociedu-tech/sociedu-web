'use client';

import { useEffect, useMemo, useState } from 'react';
import type { StatsSeriesPoint } from '@/features/dashboard/ui/stats';
import { bookingService } from '@/services/bookingService';
import { orderService } from '@/services/orderService';
import { payoutService, type FinanceSnapshot } from '@/services/payoutService';
import { flattenBookingsToSessions } from '@/features/dashboard/lib/bookingMappers';
import { mapNextSessionForMentor } from '@/features/dashboard/lib/nextSessionApi';
import type { BookingApi } from '@/features/dashboard/types/booking';
import type { MentorNextSession } from '@/features/dashboard/hooks/useMentorDashboardOverview';

export type MentorDashboardHomeData = {
  loading: boolean;
  error: string | null;
  nextSession: MentorNextSession | null;
  finance: FinanceSnapshot | null;
  orderCount: number;
  kpi: {
    activeMentees: number;
    activeBookings: number;
    sessionsThisMonth: number;
  };
  sessionByStatus: { status: string; count: number }[];
  sessionsWeekly: StatsSeriesPoint[];
};

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function buildWeeklySessionSeries(sessions: { scheduledAtIso?: string | null }[]): StatsSeriesPoint[] {
  const now = new Date();
  const buckets: StatsSeriesPoint[] = [];
  for (let i = 3; i >= 0; i -= 1) {
    const end = new Date(now);
    end.setDate(now.getDate() - i * 7);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    const label = i === 0 ? 'Tuần này' : `T-${i}`;
    const count = sessions.filter((s) => {
      if (!s.scheduledAtIso) return false;
      const d = new Date(s.scheduledAtIso);
      return !Number.isNaN(d.getTime()) && d >= start && d <= end;
    }).length;
    buckets.push({ label, value: count });
  }
  return buckets;
}

export function useMentorDashboardHome(): MentorDashboardHomeData {
  const [state, setState] = useState<MentorDashboardHomeData>({
    loading: true,
    error: null,
    nextSession: null,
    finance: null,
    orderCount: 0,
    kpi: { activeMentees: 0, activeBookings: 0, sessionsThisMonth: 0 },
    sessionByStatus: [],
    sessionsWeekly: [],
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const [bookingsPage, ordersPage, finance, nextSessionRaw] = await Promise.all([
          bookingService.listAsMentor(0, 30),
          orderService.getMyOrders(0, 10),
          payoutService.getFinanceSnapshot(5),
          bookingService.getNextSessionAsMentor(),
        ]);
        if (cancelled) return;

        const bookings = bookingsPage.items as BookingApi[];
        const sessions = flattenBookingsToSessions(bookings, 'mentor');
        const now = new Date();
        const thisMonth = monthKey(now);

        const buyerIds = new Set(
          bookings.map((b) => b.buyerId).filter((id): id is string => Boolean(id)),
        );
        const sessionsThisMonth = sessions.filter((s) => {
          if (!s.scheduledAtIso) return false;
          const d = new Date(s.scheduledAtIso);
          return !Number.isNaN(d.getTime()) && monthKey(d) === thisMonth;
        }).length;

        const upcoming = sessions.filter((s) => s.status === 'Sắp diễn ra' || s.status === 'Đang diễn ra').length;
        const completed = sessions.filter((s) => s.status === 'Hoàn thành').length;
        const activeBookings = bookings.filter(
          (b) => !['completed', 'canceled', 'cancelled'].includes(String(b.status).toLowerCase()),
        ).length;

        setState({
          loading: false,
          error: null,
          nextSession: mapNextSessionForMentor(nextSessionRaw),
          finance,
          orderCount: ordersPage.items.length,
          kpi: {
            activeMentees: buyerIds.size,
            activeBookings,
            sessionsThisMonth,
          },
          sessionByStatus: [
            { status: 'Sắp diễn ra', count: upcoming },
            { status: 'Hoàn thành', count: completed },
            { status: 'Tổng buổi', count: sessions.length },
          ].filter((x) => x.count > 0),
          sessionsWeekly: buildWeeklySessionSeries(sessions),
        });
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            loading: false,
            error: err instanceof Error ? err.message : 'Không tải được bảng điều khiển.',
          }));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => state, [state]);
}
