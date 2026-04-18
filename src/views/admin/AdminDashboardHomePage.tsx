'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Package, Shield, UserPlus } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function AdminDashboardHomePage() {
  const { data, loading, error, refresh } = useAdminData();

  if (loading) {
    return <LoadingSpinner label="Đang tải tổng quan quản trị..." />;
  }
  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  const pendingMentors = data.mentorRequests?.length ?? 0;
  const pendingProducts = data.productRequests?.length ?? 0;
  const pendingUpdates = data.updateRequests?.length ?? 0;

  const tiles = [
    {
      label: 'Yêu cầu mentor',
      value: pendingMentors,
      icon: UserPlus,
      iconWrap: 'bg-blue-light text-primary',
    },
    {
      label: 'Sản phẩm chờ duyệt',
      value: pendingProducts,
      icon: Package,
      iconWrap: 'bg-peach text-secondary-orange',
    },
    {
      label: 'Cập nhật chờ duyệt',
      value: pendingUpdates,
      icon: Shield,
      iconWrap: 'bg-purple-light text-secondary-purple',
    },
  ] as const;

  return (
    <div className="space-y-8">
      <section className="dashboard-content-card relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 -top-20 size-56 rounded-full bg-primary/[0.08] blur-3xl" aria-hidden />
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[1px] text-gray">Quản trị</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.12px] text-dark md:text-[28px] md:leading-tight">
            Tổng quan hệ thống
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray">
            Theo dõi hàng chờ phê duyệt và mở bảng điều khiển đầy đủ khi cần xử lý chi tiết.
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.label} className="dashboard-stat-tile flex items-start gap-4 p-6">
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-[8px] ${t.iconWrap}`}
            >
              <t.icon className="size-6" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray">{t.label}</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-dark">{t.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Link href="/dashboard/admin" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
        <Shield className="size-4" strokeWidth={2} />
        Mở trang quản trị đầy đủ
        <ArrowRight className="size-4" strokeWidth={2} />
      </Link>
    </div>
  );
}
