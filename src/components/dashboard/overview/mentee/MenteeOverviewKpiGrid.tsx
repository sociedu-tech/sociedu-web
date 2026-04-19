'use client';

import { CheckCircle2, ClipboardList, PlayCircle, Video } from 'lucide-react';
import { StatsKpiCard } from '@/components/dashboard/stats';
import { menteeOverviewKpi } from '@/components/dashboard/overview/mentee/menteeOverviewData';

const ITEMS = [
  {
    label: 'Dự án đang làm',
    value: menteeOverviewKpi.inProgress,
    icon: PlayCircle,
    accent: 'amber' as const,
  },
  {
    label: 'Buổi học (tháng này)',
    value: menteeOverviewKpi.sessionsThisMonth,
    icon: Video,
    accent: 'indigo' as const,
  },
  {
    label: 'Việc cần xử lý',
    value: menteeOverviewKpi.pendingItems,
    icon: ClipboardList,
    accent: 'violet' as const,
  },
  {
    label: 'Dự án hoàn thành',
    value: menteeOverviewKpi.completed,
    icon: CheckCircle2,
    accent: 'emerald' as const,
  },
] as const;

export function MenteeOverviewKpiGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {ITEMS.map((item) => (
        <StatsKpiCard
          key={item.label}
          label={item.label}
          value={item.value}
          icon={item.icon}
          accent={item.accent}
          className="dashboard-stat-tile"
        />
      ))}
    </div>
  );
}
