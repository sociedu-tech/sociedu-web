'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

/** Khối nội dung có viền nhẹ — alias `Card` variant dashboard (giữ import cũ trong codebase). */
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
    <Card variant="dashboard" padding={padding} className={className}>
      {children}
    </Card>
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
