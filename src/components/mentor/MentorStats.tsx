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
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
          <Wallet size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-airbnb-gray uppercase tracking-widest">Số dư ví</p>
          <p className="text-xl font-black text-airbnb-dark">{(stats?.walletBalance || 0).toLocaleString()}đ</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
          <ShoppingBag size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-airbnb-gray uppercase tracking-widest">Doanh thu</p>
          <p className="text-xl font-black text-airbnb-dark">{(stats?.totalRevenue || 0).toLocaleString()}đ</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
          <Users size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-airbnb-gray uppercase tracking-widest">Lượt đặt</p>
          <p className="text-xl font-black text-airbnb-dark">{stats?.totalBookings || 0}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center">
          <Star size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-airbnb-gray uppercase tracking-widest">Đánh giá</p>
          <p className="text-xl font-black text-airbnb-dark">{stats?.averageRating || 0}/5</p>
        </div>
      </div>
    </div>
  );
};
