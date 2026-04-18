import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import Link from 'next/link';
import type { User as UserType, Product } from '@/types';

interface ProfileStatsProps {
  user: UserType;
  userProducts: Product[];
}

export const ProfileStats = ({ user, userProducts }: ProfileStatsProps) => {
  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-airbnb-gray tracking-widest mb-4">Thống kê</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-airbnb-gray">Đánh giá</span>
            <div className="flex items-center gap-1 font-bold text-airbnb-dark">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              {user.rating || 0}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-airbnb-gray">Tài liệu đã bán</span>
            <span className="font-bold text-airbnb-dark">{user.totalSales || 0}</span>
          </div>
          {user.role === 'mentor' && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-airbnb-gray">Buổi tư vấn</span>
              <span className="font-bold text-airbnb-dark">{user.mentorInfo?.sessionsCompleted || 0}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mentor Packages (If Mentor) */}
      {user.role === 'mentor' && user.mentorInfo?.packages && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-airbnb-gray tracking-widest mb-4">Gói dịch vụ</h3>
          <div className="space-y-4">
            {user.mentorInfo.packages.map(pkg => (
              <div key={pkg.id} className="p-3 border border-gray-100 rounded-xl hover:border-blue-200 transition-colors">
                <p className="font-bold text-airbnb-dark text-sm">{pkg.title}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-airbnb-gray">{pkg.duration}</span>
                  <span className="text-sm font-bold text-blue-600">{pkg.price.toLocaleString()}đ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listings Preview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-airbnb-gray tracking-widest mb-4">Tài liệu mới nhất</h3>
        <div className="space-y-4">
          {userProducts.length > 0 ? (
            userProducts.slice(0, 3).map(p => (
              <Link key={p.id} href={`/product/${p.id}`} className="flex gap-3 group">
                <Image src={p.image} className="w-12 h-12 rounded object-cover" alt={p.name} width={48} height={48} unoptimized />
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-airbnb-dark truncate group-hover:text-airbnb-red transition-colors">{p.name}</p>
                  <p className="text-[10px] text-airbnb-gray mt-1">{p.price.toLocaleString()}đ</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-xs text-airbnb-gray italic">Chưa đăng tài liệu nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};
