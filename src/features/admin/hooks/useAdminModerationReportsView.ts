import { useMemo, useState } from 'react';
import type { AdminModerationReport, ModerationReportStatus } from '@/types';

export function useAdminModerationReportsView(initialReports: AdminModerationReport[]) {
  const [reports, setReports] = useState<AdminModerationReport[]>(initialReports);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    if (typeFilter === 'all') return reports;
    return reports.filter((r) => r.targetType === typeFilter);
  }, [reports, typeFilter]);

  const setStatus = (id: string, status: ModerationReportStatus) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return { reports, typeFilter, setTypeFilter, filtered, setStatus };
}
