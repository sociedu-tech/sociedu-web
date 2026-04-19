'use client';

import { FolderOpen, Star, Users, Video } from 'lucide-react';
import { StatsKpiCard } from '@/components/dashboard/stats';
import { mentorOverviewKpi } from '@/components/dashboard/overview/mentor/mentorOverviewData';

const ITEMS = [
  {
    label: 'Học viên đang hoạt động',
    value: mentorOverviewKpi.activeMentees,
    icon: Users,
    accent: 'indigo' as const,
  },
  {
    label: 'Dự án đang hướng dẫn',
    value: mentorOverviewKpi.activeProjects,
    icon: FolderOpen,
    accent: 'emerald' as const,
  },
  {
    label: 'Buổi học (tháng này)',
    value: mentorOverviewKpi.sessionsThisMonth,
    icon: Video,
    accent: 'violet' as const,
  },
  {
    label: 'Đánh giá trung bình',
    value: `${mentorOverviewKpi.avgRating}/5`,
    icon: Star,
    accent: 'amber' as const,
  },
] as const;

type Props = { hideKpiStrip?: boolean };

export function MentorOverviewKpiStrip({ hideKpiStrip = false }: Props) {
  if (hideKpiStrip) return null;

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
