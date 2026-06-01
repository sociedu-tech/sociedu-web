'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/** Wrapper chuẩn cho mọi trang dashboard — full width/height trong shell. */
export function DashboardPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex h-full min-h-0 w-full flex-1 flex-col space-y-6 pb-2', className)}>
      {children}
    </div>
  );
}
