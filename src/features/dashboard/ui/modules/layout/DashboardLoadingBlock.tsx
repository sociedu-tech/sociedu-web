'use client';

import React from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DASHBOARD_SECTION_LOADING_MIN_HEIGHT } from '@/lib/pageLoading';
import { DashboardSurface } from './DashboardSurface';
import { cn } from '@/lib/utils';

export function DashboardLoadingBlock({
  label = 'Đang tải…',
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <DashboardSurface
      className={cn(
        'flex items-center justify-center p-8',
        DASHBOARD_SECTION_LOADING_MIN_HEIGHT,
        className,
      )}
    >
      <LoadingSpinner size={32} label={label} />
    </DashboardSurface>
  );
}
