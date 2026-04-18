'use client';

import React from 'react';
import { MentorStats } from '@/components/dashboard/mentor/MentorStats';
import { useMentorData } from '@/hooks/useMentorData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function MentorDashboardHomePage() {
  const { data, loading, error, refresh } = useMentorData('1');

  if (loading) {
    return <LoadingSpinner label="Đang tải tổng quan..." />;
  }
  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="space-y-8">
      <section className="dashboard-content-card relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-10 -top-16 size-48 rounded-full bg-primary/[0.07] blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[1px] text-gray">Mentor</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.12px] text-dark md:text-[28px] md:leading-tight">
            Tổng quan hoạt động
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray">
            Số liệu nhanh về doanh thu, đặt chỗ và đánh giá — điều hướng chi tiết qua menu bên trái.
          </p>
        </div>
      </section>

      {data?.stats ? <MentorStats stats={data.stats} /> : null}
    </div>
  );
}
