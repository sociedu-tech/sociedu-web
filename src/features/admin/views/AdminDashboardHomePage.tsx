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
import { useAuth } from '@/context/AuthContext';
import { useAdminDashboardHomePage } from '@/features/admin/hooks';
import { AdminBookingActivityFeed, AdminBookingActivityFeedLink } from '@/features/admin/ui';
import {
  DashboardPage,
  DashboardSection,
  DashboardViewHeader,
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
  const { user } = useAuth();
  const { analytics, totalUsers, loaded } = useAdminDashboardHomePage();

  if (!loaded) {
    return <PageLoadingState label="Đang tải…" variant="stats" minHeight="min-h-[50vh]" />;
  }

  const { kpis } = analytics;
  const firstName = user?.fullName?.split(' ')[0];

  return (
    <DashboardPage spacing="relaxed">
      <DashboardViewHeader
        layout="featured"
        eyebrow="Quản trị hệ thống"
        title={firstName ? `Xin chào, ${firstName}` : 'Bảng điều khiển quản trị'}
        description="Theo dõi vận hành, duyệt yêu cầu và phân tích hoạt động mentoring."
      />

      <DashboardSection title="Chỉ số vận hành" description="Tổng quan nhanh các số liệu quan trọng">
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

      <DashboardSection title="Phân tích" description="Biểu đồ người dùng và hoạt động mentoring">
        <div className="grid gap-6 lg:grid-cols-2">
          <StatsChartCard title="Người dùng theo vai trò" subtitle="Dữ liệu thật từ hệ thống">
            <StatsDonutChart data={analytics.bookingMix} />
          </StatsChartCard>
          <StatsChartCard title="Hoạt động mentoring" subtitle="Booking & session">
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

      <DashboardSection
        title="Hoạt động gần đây"
        description="Cập nhật trạng thái booking từ mentor và học viên"
        action={<AdminBookingActivityFeedLink />}
      >
        <AdminBookingActivityFeed />
      </DashboardSection>
    </DashboardPage>
  );
}
