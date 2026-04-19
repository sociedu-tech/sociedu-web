'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Package, Shield, UserPlus } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import { AdminHomeCharts } from '@/components/dashboard/overview/AdminHomeCharts';
import { DashboardSection } from '@/components/dashboard/DashboardPrimitives';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function AdminDashboardHomePage() {
  const { data, loading, error, refresh } = useAdminData();

  if (loading) {
    return <LoadingSpinner label="Đang tải…" />;
  }
  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  const pendingMentors = data.mentorRequests?.length ?? 0;
  const pendingProducts = data.productRequests?.length ?? 0;
  const pendingUpdates = data.updateRequests?.length ?? 0;

  const tiles = [
    { label: 'Yêu cầu mentor', value: pendingMentors, icon: UserPlus, iconWrap: 'bg-sky-50 text-sky-800' },
    { label: 'Sản phẩm chờ duyệt', value: pendingProducts, icon: Package, iconWrap: 'bg-amber-50 text-amber-900' },
    { label: 'Cập nhật chờ duyệt', value: pendingUpdates, icon: Shield, iconWrap: 'bg-violet-50 text-violet-800' },
  ] as const;

  return (
    <div className="space-y-10">
      <DashboardSection title="Hàng chờ phê duyệt">
        <div className="grid gap-4 sm:grid-cols-3">
          {tiles.map((t) => (
            <div key={t.label} className="dashboard-stat-tile flex items-start gap-4 p-5">
              <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${t.iconWrap}`}>
                <t.icon className="size-5" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-600">{t.label}</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">{t.value}</p>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection
        title="Phân tích"
        action={
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
          >
            Mở quản trị đầy đủ
            <ArrowRight className="size-4" />
          </Link>
        }
      >
        <AdminHomeCharts />
      </DashboardSection>
    </div>
  );
}
