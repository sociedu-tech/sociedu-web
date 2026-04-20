import { useMemo, useState } from 'react';
import type { StatsTimeRange } from '@/features/dashboard/ui/stats';
import { getAdminAnalyticsMock } from '@/data/adminAnalyticsMock';

export function useAdminDashboardHomePage() {
  const [range, setRange] = useState<StatsTimeRange>('30d');
  const analytics = useMemo(() => getAdminAnalyticsMock(range), [range]);
  return { range, setRange, analytics };
}
