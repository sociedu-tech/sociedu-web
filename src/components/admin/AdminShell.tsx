'use client';

import React from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AdminFallbackBanner } from '@/components/admin/AdminFallbackBanner';
import { useAdminSectionData } from '@/components/admin/AdminDataContext';

/** Vỏ nội dung admin: một cột, không lặp sidebar (điều hướng nằm ở `DashboardSidebar`). */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const { loading, refresh, bannerVariant } = useAdminSectionData();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center py-16">
        <LoadingSpinner size={48} label="Đang tải…" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-2">
      {bannerVariant ? (
        <AdminFallbackBanner
          variant={bannerVariant}
          onRetry={bannerVariant === 'offline' ? refresh : undefined}
        />
      ) : null}
      {children}
    </div>
  );
}
