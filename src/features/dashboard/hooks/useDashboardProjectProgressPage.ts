import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import {
  MOCK_PROJECT_PROGRESS_MENTEE,
  MOCK_PROJECT_PROGRESS_MENTOR,
  PROJECT_PROGRESS_FILTERS,
  type ProjectProgressStatus,
} from '@/data/dashboardProjectProgressMock';

export function useDashboardProjectProgressPage() {
  const { userRole } = useAuth();
  const isMentor = normalizeRole(userRole) === ROLES.MENTOR;
  const base = isMentor ? MOCK_PROJECT_PROGRESS_MENTOR : MOCK_PROJECT_PROGRESS_MENTEE;
  const [filter, setFilter] = useState<'all' | ProjectProgressStatus>('all');

  const rows = useMemo(() => {
    if (filter === 'all') return base;
    return base.filter((r) => r.status === filter);
  }, [base, filter]);

  const cpHeader = isMentor ? 'Học viên / đối tác' : 'Mentor phụ trách';

  return { filter, setFilter, rows, cpHeader, filters: PROJECT_PROGRESS_FILTERS };
}
