import { useMemo, useState } from 'react';
import type { AdminModerationReport, ModerationReportStatus } from '@/types';

export type AdminReportSegment = 'all' | 'people' | 'review' | 'session';

export function useAdminModerationReportsView(
  initialReports: AdminModerationReport[],
  segment: AdminReportSegment,
) {
  const [reports, setReports] = useState<AdminModerationReport[]>(initialReports);

  const filtered = useMemo(() => {
    if (segment === 'all') return reports;
    if (segment === 'people') {
      return reports.filter((r) => r.targetType === 'user' || r.targetType === 'mentor');
    }
    if (segment === 'review') return reports.filter((r) => r.targetType === 'review');
    if (segment === 'session') return reports.filter((r) => r.targetType === 'session');
    return reports;
  }, [reports, segment]);

  const setStatus = (id: string, status: ModerationReportStatus) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return { reports, filtered, setStatus };
}
