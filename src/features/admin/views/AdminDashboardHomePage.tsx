'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  CalendarCheck,
  GraduationCap,
  Users,
  Wallet,
  Flag,
  UserPlus,
} from 'lucide-react';
import { useAdminDashboardHomePage } from '@/features/admin/hooks';
import { AdminBookingActivityFeed, AdminBookingActivityFeedLink } from '@/features/admin/ui';
import {
  DashboardPage,
  DashboardSection,
} from '@/features/dashboard/ui/modules';
import {
  StatsKpiCard,
  StatsChartCard,
  StatsBarChart,
  StatsDonutChart,
} from '@/features/dashboard/ui/stats';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ROUTES } from '@/constants/routes';

export function AdminDashboardHomePage() {
  const { analytics, totalUsers, loaded } = useAdminDashboardHomePage();

  if (!loaded) {
    return <PageLoadingState label="Đang tải…" variant="stats" minHeight="min-h-[50vh]" />;
  }

  const { kpis } = analytics;

  return (
    <DashboardPage spacing="relaxed">
      <DashboardSection title="Chỉ số vận hành">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link href={ROUTES.DASHBOARD.ADMIN.BOOKINGS.path}>
            <StatsKpiCard
              label="Tổng booking"
              value={kpis.totalBookings}
              icon={CalendarCheck}
              className="h-full transition hover:border-primary/30 hover:shadow-[var(--shadow-dashboard-elevated)]"
            />
          </Link>
          <StatsKpiCard
            label="Session đang diễn ra"
            value={kpis.liveSessions}
            hint="Trạng thái scheduled"
            icon={Activity}
            tone="featured"
          />
          <Link href="/dashboard/users/mentors">
            <StatsKpiCard
              label="Mentor"
              value={kpis.totalMentors}
              icon={GraduationCap}
              className="h-full transition hover:border-primary/30 hover:shadow-[var(--shadow-dashboard-elevated)]"
            />
          </Link>
          <Link href={ROUTES.DASHBOARD.ADMIN.USERS.path}>
            <StatsKpiCard
              label="Học viên"
              value={kpis.newLearners}
              icon={Users}
              className="h-full transition hover:border-primary/30 hover:shadow-[var(--shadow-dashboard-elevated)]"
            />
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link href="/dashboard/payouts">
            <StatsKpiCard
              label="Rút tiền chờ duyệt"
              value={kpis.pendingPayouts}
              icon={Wallet}
              className="h-full transition hover:border-primary/30 hover:shadow-[var(--shadow-dashboard-elevated)]"
            />
          </Link>
          <Link href={`${ROUTES.DASHBOARD.ADMIN.REPORTS.path}/people`}>
            <StatsKpiCard
              label="Báo cáo mở"
              value={kpis.openReports}
              icon={Flag}
              className="h-full transition hover:border-primary/30 hover:shadow-[var(--shadow-dashboard-elevated)]"
            />
          </Link>
          <Link href="/dashboard/users/mentors">
            <StatsKpiCard
              label="Duyệt mentor chờ"
              value={kpis.pendingMentorRequests}
              icon={UserPlus}
              className="h-full transition hover:border-primary/30 hover:shadow-[var(--shadow-dashboard-elevated)]"
            />
          </Link>
          <StatsKpiCard label="Tổng tài khoản" value={totalUsers} icon={Users} />
        </div>
      </DashboardSection>

      <DashboardSection title="Phân tích">
        <div className="grid gap-6 lg:grid-cols-2">
          <StatsChartCard title="Người dùng theo vai trò">
            <StatsDonutChart data={analytics.bookingMix} />
          </StatsChartCard>
          <StatsChartCard title="Hoạt động mentoring">
            <StatsBarChart
              data={[
                { label: 'Booking', value: kpis.totalBookings },
                { label: 'Session live', value: kpis.liveSessions },
              ]}
              name="Số lượng"
            />
          </StatsChartCard>
        </div>
      </DashboardSection>

      <DashboardSection title="Hoạt động gần đây" action={<AdminBookingActivityFeedLink />}>
        <AdminBookingActivityFeed />
      </DashboardSection>
    </DashboardPage>
  );
}
