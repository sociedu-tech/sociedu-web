import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { useDashboardProgressReports } from '@/features/dashboard/hooks/useDashboardProgressReports';
import { formatViDateTime } from '@/lib/apiUtils';
import { reportStatusLabel } from '@/features/dashboard/lib/bookingMappers';

export type ProjectProgressStatus = 'pending' | 'reviewed' | 'rejected' | 'all';

export const PROJECT_PROGRESS_FILTERS: { id: ProjectProgressStatus; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chờ phản hồi' },
  { id: 'reviewed', label: 'Đã phản hồi' },
  { id: 'rejected', label: 'Từ chối' },
];

export type ProjectProgressRow = {
  id: string;
  project: string;
  counterparty: string;
  progress: number;
  status: ProjectProgressStatus;
  statusLabel: string;
  updatedAt: string;
};

function mapStatus(raw?: string): ProjectProgressStatus {
  const s = String(raw ?? '').toUpperCase();
  if (s === 'REVIEWED') return 'reviewed';
  if (s === 'REJECTED') return 'rejected';
  return 'pending';
}

export function useDashboardProjectProgressPage() {
  const { userRole } = useAuth();
  const isMentor = normalizeRole(userRole) === ROLES.MENTOR;
  const { reports, loading, error, refresh } = useDashboardProgressReports(isMentor ? 'mentor' : 'mentee');
  const [filter, setFilter] = useState<ProjectProgressStatus>('all');

  const base: ProjectProgressRow[] = useMemo(
    () =>
      reports.map((r) => {
        const status = mapStatus(r.status);
        return {
          id: r.id,
          project: r.title,
          counterparty: isMentor
            ? r.menteeName?.trim() || (r.menteeId ? `Học viên #${String(r.menteeId).slice(0, 8)}` : '—')
            : r.mentorName?.trim() || (r.mentorId ? `Mentor #${String(r.mentorId).slice(0, 8)}` : '—'),
          progress: status === 'reviewed' ? 100 : status === 'pending' ? 45 : 10,
          status,
          statusLabel: reportStatusLabel(r.status),
          updatedAt: formatViDateTime(r.updatedAt ?? r.createdAt),
        };
      }),
    [reports, isMentor],
  );

  const rows = useMemo(() => {
    if (filter === 'all') return base;
    return base.filter((r) => r.status === filter);
  }, [base, filter]);

  const cpHeader = isMentor ? 'Học viên / đối tác' : 'Mentor phụ trách';

  return { filter, setFilter, rows, cpHeader, filters: PROJECT_PROGRESS_FILTERS, loading, error, refresh };
}
