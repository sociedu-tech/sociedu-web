'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/** Khối nội dung có viền nhẹ — dùng cho bảng, form, biểu đồ */
export function DashboardCard({
  children,
  className,
  padding = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** false: tự padding (vd. bảng full width) */
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white',
        padding && 'p-5 sm:p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Nhóm mục với tiêu đề ngắn — không dùng đoạn mô tả dài */
export function DashboardSection({
  title,
  children,
  className,
  action,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold tracking-tight text-slate-900">{title}</h2>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

/** Tiêu đề trang con (khi breadcrumb không đủ ngữ cảnh) */
export function DashboardPageHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
