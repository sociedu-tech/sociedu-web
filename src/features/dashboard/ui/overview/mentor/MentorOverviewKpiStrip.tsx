'use client';

import { FolderOpen, Star, Users, Video } from 'lucide-react';
import { StatsKpiCard } from '@/features/dashboard/ui/stats';
import { mentorOverviewKpi } from '@/data/mentorOverviewMock';

const ITEMS = [
  {
    label: 'Học viên đang hoạt động',
    value: mentorOverviewKpi.activeMentees,
    icon: Users,
  },
  {
    label: 'Dự án đang hướng dẫn',
    value: mentorOverviewKpi.activeProjects,
    icon: FolderOpen,
  },
  {
    label: 'Buổi học (tháng này)',
    value: mentorOverviewKpi.sessionsThisMonth,
    icon: Video,
  },
  {
    label: 'Đánh giá trung bình',
    value: `${mentorOverviewKpi.avgRating}/5`,
    icon: Star,
  },
] as const;

type Props = { hideKpiStrip?: boolean };

export function MentorOverviewKpiStrip({ hideKpiStrip = false }: Props) {
  if (hideKpiStrip) return null;

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
