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

export const MentorStats = ({ stats }: MentorStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          <Wallet size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Số dư ví</p>
          <p className="text-2xl font-bold text-dark">{(stats?.walletBalance || 0).toLocaleString()}đ</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
          <ShoppingBag size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Doanh thu</p>
          <p className="text-2xl font-bold text-dark">{(stats?.totalRevenue || 0).toLocaleString()}đ</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
          <Users size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Lượt đặt</p>
          <p className="text-2xl font-bold text-dark">{stats?.totalBookings || 0}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
          <Star size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Đánh giá</p>
          <p className="text-2xl font-bold text-dark">{stats?.averageRating || 0}/5</p>
        </div>
      </div>
    </div>
  );
};
