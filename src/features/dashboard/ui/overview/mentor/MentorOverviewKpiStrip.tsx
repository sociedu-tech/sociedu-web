'use client';

import { FolderOpen, Star, Users, Video } from 'lucide-react';
import { StatsKpiCard } from '@/features/dashboard/ui/stats';
import type { MentorOverviewData } from '@/features/dashboard/hooks/useMentorDashboardOverview';

type Props = {
  hideKpiStrip?: boolean;
  kpi: MentorOverviewData['kpi'];
};

export function MentorOverviewKpiStrip({ hideKpiStrip = false, kpi }: Props) {
  if (hideKpiStrip) return null;

  const ITEMS = [
    { label: 'Học viên đang hoạt động', value: kpi.activeMentees, icon: Users },
    { label: 'Booking đang mở', value: kpi.activeBookings, icon: FolderOpen },
    { label: 'Buổi học (tháng này)', value: kpi.sessionsThisMonth, icon: Video },
    { label: 'Đánh giá trung bình', value: `${kpi.avgRating}`, icon: Star },
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
