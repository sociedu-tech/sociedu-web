'use client';

import { useEffect, useMemo, useState } from 'react';
import type { StatsSeriesPoint } from '@/features/dashboard/ui/stats';
import { bookingService } from '@/services/bookingService';
import { orderService } from '@/services/orderService';
import { payoutService } from '@/services/payoutService';
import { reportService } from '@/services/reportService';
import { flattenBookingsToSessions } from '@/features/dashboard/lib/bookingMappers';
import type { BookingApi } from '@/features/dashboard/types/booking';

export type MentorOverviewData = {
  loading: boolean;
  error: string | null;
  kpi: {
    activeMentees: number;
    activeProjects: number;
    sessionsThisMonth: number;
    avgRating: string;
  };
  revenueByWeek: { t: string; revenueM: number; sessions: number }[];
  projectByStatus: { status: string; count: number }[];
  revenueGrowthSeries: StatsSeriesPoint[];
  menteeGrowthSeries: StatsSeriesPoint[];
  projectMonthly: { thang: string; moMoi: number; hoanThanh: number }[];
};

const EMPTY: MentorOverviewData = {
  loading: true,
  error: null,
  kpi: { activeMentees: 0, activeProjects: 0, sessionsThisMonth: 0, avgRating: '—' },
  revenueByWeek: [],
  projectByStatus: [],
  revenueGrowthSeries: [],
  menteeGrowthSeries: [],
  projectMonthly: [],
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
        const [bookingsPage, ordersPage, finance, reportsPage] = await Promise.all([
          bookingService.listAsMentor(0, 50),
          orderService.getMyOrders(0, 50),
          payoutService.getFinanceSnapshot(),
          reportService.getAssignedReports(0, 50),
        ]);

        if (cancelled) return;

        const bookings = bookingsPage.items as BookingApi[];
        const sessions = flattenBookingsToSessions(bookings, 'mentor');
        const orders = ordersPage.items;
        const reports = reportsPage.items;

        const buyerIds = new Set(
          bookings.map((b) => b.buyerId).filter((id): id is string => Boolean(id)),
        );

        const now = new Date();
        const thisMonth = monthKey(now);
        const sessionsThisMonth = sessions.filter((s) => {
          const d = new Date(s.when);
          return !Number.isNaN(d.getTime()) && monthKey(d) === thisMonth;
        }).length;

        const pending = reports.filter((r) => String(r.status).toUpperCase() === 'PENDING').length;
        const reviewed = reports.filter((r) => String(r.status).toUpperCase() === 'REVIEWED').length;

        const revenueByWeek: MentorOverviewData['revenueByWeek'] = [];
        for (let i = 3; i >= 0; i -= 1) {
          const label = `Tuần ${4 - i}`;
          revenueByWeek.push({
            t: label,
            revenueM: Number((finance.totalRevenue / 4 / 1_000_000).toFixed(1)),
            sessions: Math.max(0, Math.round(sessions.length / 4)),
          });
        }

        const projectByStatus = [
          { status: 'Chờ phản hồi', count: pending },
          { status: 'Đã phản hồi', count: reviewed },
          { status: 'Buổi học', count: sessions.length },
        ].filter((x) => x.count > 0);

        const revenueGrowthSeries: StatsSeriesPoint[] = [
          { label: 'Hiện tại', value: Math.round(finance.totalRevenue / 1_000_000) },
        ];

        const menteeGrowthSeries: StatsSeriesPoint[] = [
          { label: 'Học viên', value: buyerIds.size },
        ];

        const projectMonthly = [
          {
            thang: monthLabel(thisMonth),
            moMoi: reports.length,
            hoanThanh: reviewed,
          },
        ];

        setState({
          loading: false,
          error: null,
          kpi: {
            activeMentees: buyerIds.size,
            activeProjects: reports.length,
            sessionsThisMonth,
            avgRating: orders.length > 0 ? '—' : '—',
          },
          revenueByWeek,
          projectByStatus,
          revenueGrowthSeries,
          menteeGrowthSeries,
          projectMonthly,
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
