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
  },
  {
    key: 'revenue',
    label: 'Doanh thu',
    get: (s: MentorStatsProps['stats']) => `${(s?.totalRevenue || 0).toLocaleString()}đ`,
    icon: ShoppingBag,
  },
  {
    key: 'bookings',
    label: 'Lượt đặt',
    get: (s: MentorStatsProps['stats']) => String(s?.totalBookings || 0),
    icon: Users,
  },
  {
    key: 'rating',
    label: 'Đánh giá',
    get: (s: MentorStatsProps['stats']) => `${s?.averageRating || 0}/5`,
    icon: Star,
  },
] as const;

export const MentorStats = ({ stats }: MentorStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <StatsKpiCard
          key={item.key}
          label={item.label}
          value={item.get(stats)}
          icon={item.icon}
          tone={i === 0 ? 'featured' : 'default'}
          className="dashboard-stat-tile"
        />
      ))}
    </div>
  );
};
