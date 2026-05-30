'use client';

import { useCallback } from 'react';
import type { AdminModerationReport, ModerationReportStatus } from '@/types';
import { adminModerationService } from '@/services/adminModerationService';
import { usePaginatedList } from '@/hooks/usePaginatedList';

export type AdminReportSegment = 'all' | 'people' | 'review' | 'session';

export function useAdminModerationReportsView(segment: AdminReportSegment) {
  const paginated = usePaginatedList<AdminModerationReport>({
    fetchPage: useCallback(
      (page, size) => adminModerationService.list({ segment, page, size }),
      [segment],
    ),
    resetKey: segment,
  });

  const setStatus = async (id: string, status: ModerationReportStatus) => {
    try {
      await adminModerationService.resolve(id, { status });
      await paginated.refresh();
    } catch {
      /* keep current list */
    }
  };

  return {
    reports: paginated.items,
    filtered: paginated.items,
    setStatus,
    loading: paginated.loading,
    error: paginated.error,
    page: paginated.page,
    size: paginated.size,
    total: paginated.total,
    totalPages: paginated.totalPages,
    setPage: paginated.setPage,
    setSize: paginated.setSize,
    refresh: paginated.refresh,
  };
}
