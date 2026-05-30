'use client';

import { useCallback, useMemo } from 'react';
import { reportService, type ProgressReport } from '@/services/reportService';
import { reportStatusLabel } from '@/features/dashboard/lib/bookingMappers';
import type { DashboardProjectRow } from '@/features/dashboard/types/booking';
import { usePaginatedList } from '@/hooks/usePaginatedList';

export type ProgressReportsRole = 'mentee' | 'mentor';

export function useDashboardProgressReports(role: ProgressReportsRole) {
  const paginated = usePaginatedList<ProgressReport>({
    fetchPage: useCallback(
      (page, size) =>
        role === 'mentor' ? reportService.getAssignedReports(page, size) : reportService.getMyReports(page, size),
      [role],
    ),
    resetKey: role,
  });

  const projectRows: DashboardProjectRow[] = paginated.items.map((r) => ({
    id: r.id,
    name: r.title,
    mentor: r.mentorName?.trim() || (r.mentorId ? `Mentor #${String(r.mentorId).slice(0, 8)}` : '—'),
    mentee: r.menteeName?.trim() || (r.menteeId ? `Học viên #${String(r.menteeId).slice(0, 8)}` : undefined),
    status: reportStatusLabel(r.status),
  }));

  const pendingForMentor = paginated.items.filter((r) => String(r.status).toUpperCase() === 'PENDING');

  return {
    reports: paginated.items,
    projectRows,
    pendingForMentor,
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
