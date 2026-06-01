'use client';

import React from 'react';
import { cn } from '@/lib/utils';

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
  return (
    <div
      className={cn(
        'flex h-full min-h-0 w-full flex-1 flex-col pb-2',
        spacing === 'relaxed' ? 'space-y-8' : 'space-y-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
