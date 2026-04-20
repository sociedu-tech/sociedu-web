import React from 'react';
import { ShoppingBag, Users, Star, Wallet } from 'lucide-react';
import { StatsKpiCard } from '@/features/dashboard/ui/stats';

interface MentorStatsProps {
  stats: {
    totalRevenue: number;
    totalBookings: number;
    averageRating: number;
    walletBalance: number;
  };
}

const items = [
  {
    key: 'wallet',
    label: 'Số dư ví',
    get: (s: MentorStatsProps['stats']) => `${(s?.walletBalance || 0).toLocaleString()}đ`,
    icon: Wallet,
    accent: 'indigo' as const,
  },
  {
    key: 'revenue',
    label: 'Doanh thu',
    get: (s: MentorStatsProps['stats']) => `${(s?.totalRevenue || 0).toLocaleString()}đ`,
    icon: ShoppingBag,
    accent: 'emerald' as const,
  },
  {
    key: 'bookings',
    label: 'Lượt đặt',
    get: (s: MentorStatsProps['stats']) => String(s?.totalBookings || 0),
    icon: Users,
    accent: 'violet' as const,
  },
  {
    key: 'rating',
    label: 'Đánh giá',
    get: (s: MentorStatsProps['stats']) => `${s?.averageRating || 0}/5`,
    icon: Star,
    accent: 'amber' as const,
  },
] as const;

export const MentorStats = ({ stats }: MentorStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <StatsKpiCard
          key={item.key}
          label={item.label}
          value={item.get(stats)}
          icon={item.icon}
          accent={item.accent}
          className="dashboard-stat-tile"
        />
      ))}
    </div>
  );
};
