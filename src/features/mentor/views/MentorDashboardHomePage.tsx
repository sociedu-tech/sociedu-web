'use client';

import Link from 'next/link';
import { formatViDateTime } from '@/lib/apiUtils';
import { useAuth } from '@/context/AuthContext';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import {
  DashboardPage,
  DashboardSection,
  DashboardSurface,
  DashboardViewHeader,
} from '@/features/dashboard/ui/modules';
import { MentorNextSessionBanner } from '@/features/dashboard/ui/overview/mentor/MentorNextSessionBanner';
import { MentorFinanceKpiGrid, MentorFinanceQuickActions } from '@/features/dashboard/ui/mentor/MentorFinanceKpiGrid';
import { StatsChartCard, StatsBarChart, StatsKpiCard } from '@/features/dashboard/ui/stats';
import { useMentorDashboardHome } from '@/features/mentor/hooks/useMentorDashboardHome';
import { formatVnd, PayoutStatusBadge } from '@/features/finance/lib/payoutUi';
import { Users, CalendarCheck, BookOpen } from 'lucide-react';

export function MentorDashboardHomePage() {
  const { user } = useAuth();
  const data = useMentorDashboardHome();
  const firstName = user?.fullName?.split(' ')[0];

  if (data.loading) {
    return <PageLoadingState label="Đang tải bảng điều khiển…" variant="stats" minHeight="min-h-[50vh]" />;
  }

  if (data.error) {
    return <ErrorMessage message={data.error} />;
  }

  return (
    <DashboardPage spacing="relaxed">
      <DashboardViewHeader
        layout="featured"
        eyebrow="Không gian mentor"
        title={firstName ? `Xin chào, ${firstName}` : 'Bảng điều khiển mentor'}
        description="Quản lý buổi học, thu nhập và học viên của bạn."
      />

      <DashboardSection title="Buổi học sắp tới">
        <MentorNextSessionBanner nextSession={data.nextSession} />
      </DashboardSection>

      {data.finance ? (
        <DashboardSection
          title="Tài chính"
          description="Số dư, thu nhập và rút tiền"
          action={<MentorFinanceQuickActions />}
        >
          <MentorFinanceKpiGrid finance={data.finance} orderCount={data.orderCount} />
        </DashboardSection>
      ) : null}

      <DashboardSection title="Tổng quan hoạt động">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsKpiCard label="Học viên" value={data.kpi.activeMentees} icon={Users} />
          <StatsKpiCard label="Chương trình đang chạy" value={data.kpi.activeBookings} icon={BookOpen} />
          <StatsKpiCard
            label="Buổi học tháng này"
            value={data.kpi.sessionsThisMonth}
            icon={CalendarCheck}
          />
        </div>
      </DashboardSection>

      <DashboardSection title="Thống kê buổi học">
        <div className="grid gap-6 lg:grid-cols-2">
          <StatsChartCard title="Buổi học theo tuần" subtitle="4 tuần gần nhất">
            <StatsBarChart data={data.sessionsWeekly} name="Buổi" />
          </StatsChartCard>
          <StatsChartCard title="Trạng thái buổi học" subtitle="Từ dữ liệu mentoring">
            <StatsBarChart
              data={data.sessionByStatus.map((s) => ({ label: s.status, value: s.count }))}
              name="Buổi"
            />
          </StatsChartCard>
        </div>
      </DashboardSection>

      {data.finance && data.finance.payouts.length > 0 ? (
        <DashboardSection
          title="Rút tiền gần đây"
          action={
            <Link href="/dashboard/payouts" className="text-xs font-semibold text-primary hover:underline">
              Xem tất cả
            </Link>
          }
        >
          <DashboardSurface>
            <ul className="divide-y divide-dashboard-border-subtle">
              {data.finance.payouts.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/dashboard/payouts/${p.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-dashboard-canvas"
                  >
                    <div>
                      <p className="text-sm font-semibold text-dashboard-ink">{formatVnd(p.grossAmount)}</p>
                      <p className="text-xs text-dashboard-muted">{formatViDateTime(p.createdAt)}</p>
                    </div>
                    <PayoutStatusBadge status={p.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </DashboardSurface>
        </DashboardSection>
      ) : null}
    </DashboardPage>
  );
}
