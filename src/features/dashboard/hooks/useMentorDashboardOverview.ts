'use client';

import { useEffect, useMemo, useState } from 'react';
import type { StatsSeriesPoint } from '@/features/dashboard/ui/stats';
import { bookingService } from '@/services/bookingService';
import { orderService } from '@/services/orderService';
import { payoutService } from '@/services/payoutService';
import { flattenBookingsToSessions } from '@/features/dashboard/lib/bookingMappers';
import { mapNextSessionForMentor } from '@/features/dashboard/lib/nextSessionApi';
import type { BookingApi } from '@/features/dashboard/types/booking';

export type MentorNextSession = { title: string; when: string; mentee: string };

export type MentorOverviewData = {
  loading: boolean;
  error: string | null;
  nextSession: MentorNextSession | null;
  kpi: {
    activeMentees: number;
    activeBookings: number;
    sessionsThisMonth: number;
    avgRating: string;
  };
  revenueByWeek: { t: string; revenueM: number; sessions: number }[];
  sessionByStatus: { status: string; count: number }[];
  revenueGrowthSeries: StatsSeriesPoint[];
  menteeGrowthSeries: StatsSeriesPoint[];
  sessionMonthly: { thang: string; scheduled: number; completed: number }[];
};

const EMPTY: MentorOverviewData = {
  loading: true,
  error: null,
  nextSession: null,
  kpi: { activeMentees: 0, activeBookings: 0, sessionsThisMonth: 0, avgRating: '—' },
  revenueByWeek: [],
  sessionByStatus: [],
  revenueGrowthSeries: [],
  menteeGrowthSeries: [],
  sessionMonthly: [],
};

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key: string): string {
  const [, m] = key.split('-');
  return `T${Number(m)}`;
}

export function useMentorDashboardOverview(): MentorOverviewData {
  const [state, setState] = useState<MentorOverviewData>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const [bookingsPage, ordersPage, finance, nextSessionRaw] = await Promise.all([
          bookingService.listAsMentor(0, 50),
          orderService.getMyOrders(0, 50),
          payoutService.getFinanceSnapshot(),
          bookingService.getNextSessionAsMentor(),
        ]);

        if (cancelled) return;

        const bookings = bookingsPage.items as BookingApi[];
        const sessions = flattenBookingsToSessions(bookings, 'mentor');
        const orders = ordersPage.items;

        const buyerIds = new Set(
          bookings.map((b) => b.buyerId).filter((id): id is string => Boolean(id)),
        );

        const now = new Date();
        const thisMonth = monthKey(now);
        const sessionsThisMonth = sessions.filter((s) => {
          const d = new Date(s.when);
          return !Number.isNaN(d.getTime()) && monthKey(d) === thisMonth;
        }).length;

        const upcomingSessions = sessions.filter(
          (s) => s.status === 'Sắp diễn ra' || s.status === 'Đang diễn ra',
        );
        const upcoming = upcomingSessions.length;
        const completed = sessions.filter((s) => s.status === 'Hoàn thành').length;
        const nextSession = mapNextSessionForMentor(nextSessionRaw);

        const revenueByWeek: MentorOverviewData['revenueByWeek'] = [];
        for (let i = 3; i >= 0; i -= 1) {
          const label = `Tuần ${4 - i}`;
          revenueByWeek.push({
            t: label,
            revenueM: Number((finance.totalRevenue / 4 / 1_000_000).toFixed(1)),
            sessions: Math.max(0, Math.round(sessions.length / 4)),
          });
        }

        const sessionByStatus = [
          { status: 'Sắp diễn ra', count: upcoming },
          { status: 'Hoàn thành', count: completed },
          { status: 'Tổng buổi', count: sessions.length },
        ].filter((x) => x.count > 0);

        const activeBookings = bookings.filter(
          (b) => !['completed', 'canceled', 'cancelled'].includes(String(b.status).toLowerCase()),
        ).length;

        setState({
          loading: false,
          error: null,
          nextSession,
          kpi: {
            activeMentees: buyerIds.size,
            activeBookings,
            sessionsThisMonth,
            avgRating: orders.length > 0 ? '—' : '—',
          },
          revenueByWeek,
          sessionByStatus,
          revenueGrowthSeries: [
            { label: 'Hiện tại', value: Math.round(finance.totalRevenue / 1_000_000) },
          ],
          menteeGrowthSeries: [{ label: 'Học viên', value: buyerIds.size }],
          sessionMonthly: [
            {
              thang: monthLabel(thisMonth),
              scheduled: upcoming,
              completed,
            },
          ],
        });
      } catch (err: unknown) {
        if (!cancelled) {
          setState({
            ...EMPTY,
            loading: false,
            error: err instanceof Error ? err.message : 'Không tải được tổng quan mentor.',
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
