'use client';

import { CheckCircle2, ClipboardList, PlayCircle, Video } from 'lucide-react';
import { StatsKpiCard } from '@/features/dashboard/ui/stats';
import { menteeOverviewKpi } from '@/data/menteeOverviewMock';

const ITEMS = [
  {
    label: 'Dự án đang làm',
    value: menteeOverviewKpi.inProgress,
    icon: PlayCircle,
  },
  {
    label: 'Buổi học (tháng này)',
    value: menteeOverviewKpi.sessionsThisMonth,
    icon: Video,
  },
  {
    label: 'Việc cần xử lý',
    value: menteeOverviewKpi.pendingItems,
    icon: ClipboardList,
  },
  {
    label: 'Dự án hoàn thành',
    value: menteeOverviewKpi.completed,
    icon: CheckCircle2,
  },
] as const;

export function MenteeOverviewKpiGrid() {
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
