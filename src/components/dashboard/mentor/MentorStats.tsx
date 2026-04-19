import React from 'react';
import { ShoppingBag, Users, Star, Wallet } from 'lucide-react';

interface MentorStatsProps {
  stats: {
    totalRevenue: number;
    totalBookings: number;
    averageRating: number;
    walletBalance: number;
  };
}

/** Màu accent theo DESIGN.md §2 (primary blue + secondary palette) */
const items = [
  {
    key: 'wallet',
    label: 'Số dư ví',
    get: (s: MentorStatsProps['stats']) => `${(s?.walletBalance || 0).toLocaleString()}đ`,
    icon: Wallet,
    iconWrap: 'bg-blue-light text-primary',
  },
  {
    key: 'revenue',
    label: 'Doanh thu',
    get: (s: MentorStatsProps['stats']) => `${(s?.totalRevenue || 0).toLocaleString()}đ`,
    icon: ShoppingBag,
    iconWrap: 'bg-mint text-secondary-green',
  },
  {
    key: 'bookings',
    label: 'Lượt đặt',
    get: (s: MentorStatsProps['stats']) => String(s?.totalBookings || 0),
    icon: Users,
    iconWrap: 'bg-peach text-secondary-orange',
  },
  {
    key: 'rating',
    label: 'Đánh giá',
    get: (s: MentorStatsProps['stats']) => `${s?.averageRating || 0}/5`,
    icon: Star,
    iconWrap: 'bg-pink-light text-secondary-pink',
  },
] as const;

export const MentorStats = ({ stats }: MentorStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.key} className="dashboard-stat-tile flex items-center gap-4 p-5">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${item.iconWrap}`}
          >
            <item.icon className="size-6" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-600">{item.label}</p>
            <p className="mt-0.5 truncate text-xl font-semibold tabular-nums text-slate-900 sm:text-2xl">
              {item.get(stats)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
