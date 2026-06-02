'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useIsAdminDashboard } from '@/features/dashboard/hooks/useIsAdminDashboard';

/** Wrapper chuẩn cho mọi trang dashboard — full width trong shell, rhythm thống nhất. */
export function DashboardPage({
  children,
  className,
  spacing = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  /** `relaxed` cho trang tổng quan (home), `default` cho trang danh sách/chi tiết. */
  spacing?: 'default' | 'relaxed';
}) {
  const isAdmin = useIsAdminDashboard();

  return (
    <div
      className={cn(
        'flex w-full flex-col',
        isAdmin ? 'min-h-0' : 'h-full min-h-0 flex-1 pb-2',
        spacing === 'relaxed' ? (isAdmin ? 'space-y-5' : 'space-y-8') : isAdmin ? 'space-y-4' : 'space-y-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
