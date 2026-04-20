'use client';

import React from 'react';
import Link from 'next/link';
import { UserPlus, Activity, CalendarCheck, GraduationCap, Users } from 'lucide-react';
import { useAdminData, useAdminDashboardHomePage } from '@/features/admin/hooks';
import {
  StatsTimeRangeFilter,
  StatsKpiCard,
  StatsChartCard,
  StatsAreaChart,
  StatsLineChart,
  StatsBarChart,
  StatsDonutChart,
} from '@/features/dashboard/ui/stats';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AdminFallbackBanner } from '@/features/admin/ui/AdminFallbackBanner';
import { ROUTES } from '@/constants/routes';

/**
 * Trang duy nhất cho admin tại `/dashboard`: tổng quan vận hành + thống kê + hàng chờ duyệt mentor.
 */
export function AdminDashboardHomePage() {
  const { data, loading, refresh, bannerVariant } = useAdminData();
  const { range, setRange, analytics } = useAdminDashboardHomePage();

  if (loading) {
    return <LoadingSpinner label="Đang tải…" />;
  }

  const pendingMentors = data.mentorRequests?.length ?? 0;

  return (
    <div className="space-y-12 pb-4">
      {bannerVariant ? (
        <AdminFallbackBanner
          variant={bannerVariant}
          onRetry={bannerVariant === 'offline' ? refresh : undefined}
        />
      ) : null}

      <section className="space-y-6" aria-label="Chỉ số chính">
        <div className="flex justify-end">
          <StatsTimeRangeFilter value={range} onChange={setRange} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsKpiCard
            label="Session đang diễn ra"
            value={analytics.kpis.liveSessions}
            hint="Ước tính realtime"
            deltaPct={analytics.deltas.liveSessions}
            icon={Activity}
            tone="featured"
          />
          <StatsKpiCard
            label="Tổng booking"
            value={analytics.kpis.totalBookings}
            deltaPct={analytics.deltas.totalBookings}
            icon={CalendarCheck}
          />
          <StatsKpiCard
            label="Tổng mentor"
            value={analytics.kpis.totalMentors}
            deltaPct={analytics.deltas.totalMentors}
            icon={GraduationCap}
          />
          <StatsKpiCard
            label="Học viên mới"
            value={analytics.kpis.newLearners}
            deltaPct={analytics.deltas.newLearners}
            icon={Users}
          />
        </div>
      </section>

      <section className="space-y-6" aria-label="Phân tích xu hướng">
        <div className="grid gap-6 lg:grid-cols-2">
          <StatsChartCard title="Session theo thời gian" subtitle="Số session trong kỳ">
            <StatsAreaChart data={analytics.series.sessions} name="Session" />
          </StatsChartCard>
          <StatsChartCard title="Booking theo thời gian" subtitle="Lượt đặt lịch">
            <StatsLineChart data={analytics.series.bookings} name="Booking" />
          </StatsChartCard>
          <StatsChartCard title="Mentor hoạt động" subtitle="Theo kỳ">
            <StatsBarChart data={analytics.series.mentors} name="Mentor" />
          </StatsChartCard>
          <StatsChartCard title="Học viên mới" subtitle="Người đăng ký / kích hoạt">
            <StatsAreaChart data={analytics.series.learners} name="Học viên" />
          </StatsChartCard>
        </div>

        <StatsChartCard title="Cơ cấu booking" subtitle="Phân bổ theo loại hình (minh họa)">
          <StatsDonutChart data={analytics.bookingMix} />
        </StatsChartCard>
      </section>

      <section className="space-y-5" aria-label="Hàng chờ duyệt mentor">
        <div className="flex justify-end">
          <Link
            href={ROUTES.DASHBOARD.ADMIN.MENTOR_REQUESTS.path}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Mở danh sách đầy đủ
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                <UserPlus className="size-7 text-primary" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Đang chờ xử lý</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">{pendingMentors}</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              {pendingMentors === 0
                ? 'Không có yêu cầu nào trong hàng chờ.'
                : `Có ${pendingMentors} hồ sơ cần duyệt. Vào trang chi tiết để xem thông tin và thao tác.`}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
