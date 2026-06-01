'use client';

import { CheckCircle2, ClipboardList, PlayCircle, Video } from 'lucide-react';
import { StatsKpiCard } from '@/features/dashboard/ui/stats';
import type { MenteeOverviewData } from '@/features/dashboard/hooks/useMenteeDashboardOverview';

type Props = { kpi: MenteeOverviewData['kpi'] };

export function MenteeOverviewKpiGrid({ kpi }: Props) {
  const ITEMS = [
    { label: 'Gói đang học', value: kpi.activeBookings, icon: PlayCircle },
    { label: 'Buổi sắp tới', value: kpi.upcomingSessions, icon: Video },
    { label: 'Buổi hoàn thành', value: kpi.completedSessions, icon: ClipboardList },
    { label: 'Hoàn thành (%)', value: `${kpi.completionPct}%`, icon: CheckCircle2 },
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {ITEMS.map((item, i) => (
        <StatsKpiCard
          key={item.label}
          label={item.label}
          value={item.value}
          icon={item.icon}
          tone={i === 0 ? 'featured' : 'default'}
          className="dashboard-stat-tile"
        />
      ))}
    </div>
  );
}
