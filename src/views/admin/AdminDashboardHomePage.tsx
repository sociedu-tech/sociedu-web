'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { UserPlus, Activity, CalendarCheck, GraduationCap, Users } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import { getAdminAnalyticsMock } from '@/data/adminAnalyticsMock';
import {
  AdminTimeRangeFilter,
  AdminKpiStatCard,
  AdminChartCard,
  AdminAreaChart,
  AdminLineChart,
  AdminBarChart,
  AdminDonutChart,
  type AdminTimeRange,
} from '@/components/admin/charts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AdminFallbackBanner } from '@/components/admin/AdminFallbackBanner';
import { ADMIN_PATHS } from '@/components/admin/adminPaths';

/**
 * Trang duy nhất cho admin tại `/dashboard`: tổng quan vận hành + thống kê + hàng chờ duyệt mentor.
 */
export function AdminDashboardHomePage() {
  const { data, loading, refresh, bannerVariant } = useAdminData();
  const [range, setRange] = useState<AdminTimeRange>('30d');
  const analytics = useMemo(() => getAdminAnalyticsMock(range), [range]);

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

      <header className="border-b border-slate-100 pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-600">Quản trị</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]">
          Bảng điều khiển vận hành
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
          Theo dõi hoạt động nền tảng: session, đặt lịch, đội ngũ mentor và học viên. Dùng bộ lọc thời gian để so
          sánh xu hướng; xử lý hàng chờ duyệt mentor ngay bên dưới.
        </p>
      </header>

      <section className="space-y-6" aria-labelledby="metrics-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="metrics-heading" className="text-base font-semibold text-slate-900">
              Chỉ số chính
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Tổng hợp theo khoảng thời gian bạn chọn (dữ liệu mẫu cho đến khi nối API).
            </p>
          </div>
          <AdminTimeRangeFilter value={range} onChange={setRange} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminKpiStatCard
            label="Session đang diễn ra"
            value={analytics.kpis.liveSessions}
            hint="Ước tính realtime"
            deltaPct={analytics.deltas.liveSessions}
            icon={Activity}
            accent="indigo"
          />
          <AdminKpiStatCard
            label="Tổng booking"
            value={analytics.kpis.totalBookings}
            deltaPct={analytics.deltas.totalBookings}
            icon={CalendarCheck}
            accent="emerald"
          />
          <AdminKpiStatCard
            label="Tổng mentor"
            value={analytics.kpis.totalMentors}
            deltaPct={analytics.deltas.totalMentors}
            icon={GraduationCap}
            accent="violet"
          />
          <AdminKpiStatCard
            label="Học viên mới"
            value={analytics.kpis.newLearners}
            deltaPct={analytics.deltas.newLearners}
            icon={Users}
            accent="amber"
          />
        </div>
      </section>

      <section className="space-y-6" aria-labelledby="charts-heading">
        <div>
          <h2 id="charts-heading" className="text-base font-semibold text-slate-900">
            Phân tích xu hướng
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Biểu đồ minh họa tăng trưởng theo từng thành phần — có thể tái sử dụng ở các báo cáo sau này.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminChartCard title="Session theo thời gian" subtitle="Số session trong kỳ">
            <AdminAreaChart
              data={analytics.series.sessions}
              name="Session"
              colorVar="rgb(79 70 229)"
            />
          </AdminChartCard>
          <AdminChartCard title="Booking theo thời gian" subtitle="Lượt đặt lịch">
            <AdminLineChart data={analytics.series.bookings} name="Booking" colorVar="rgb(16 185 129)" />
          </AdminChartCard>
          <AdminChartCard title="Mentor hoạt động" subtitle="Theo kỳ">
            <AdminBarChart data={analytics.series.mentors} name="Mentor" colorVar="rgb(139 92 246)" />
          </AdminChartCard>
          <AdminChartCard title="Học viên mới" subtitle="Người đăng ký / kích hoạt">
            <AdminAreaChart
              data={analytics.series.learners}
              name="Học viên"
              colorVar="rgb(245 158 11)"
            />
          </AdminChartCard>
        </div>

        <AdminChartCard title="Cơ cấu booking" subtitle="Phân bổ theo loại hình (minh họa)">
          <AdminDonutChart data={analytics.bookingMix} />
        </AdminChartCard>
      </section>

      <section className="space-y-5" aria-labelledby="queue-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="queue-heading" className="text-base font-semibold text-slate-900">
              Hàng chờ duyệt mentor
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Hồ sơ đăng ký trở thành mentor cần xử lý trước khi hiển thị công khai trên nền tảng.
            </p>
          </div>
          <Link
            href={ADMIN_PATHS.mentorRequests}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Mở danh sách đầy đủ
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-100">
                <UserPlus className="size-7 text-sky-700" strokeWidth={2} />
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
