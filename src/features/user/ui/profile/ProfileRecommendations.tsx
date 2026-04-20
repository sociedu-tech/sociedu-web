import React from 'react';
import Image from 'next/image';
import { ThumbsUp } from 'lucide-react';
import type { User as UserType } from '@/types';

interface ProfileRecommendationsProps {
  user: UserType;
  isOwnProfile: boolean;
}

export const ProfileRecommendations = ({ user, isOwnProfile }: ProfileRecommendationsProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-airbnb-dark flex items-center gap-2">
          <ThumbsUp size={24} className="text-blue-600" /> Lời khen ngợi
        </h2>
        {!isOwnProfile && (
          <button className="text-blue-600 font-bold text-sm hover:underline">Viết lời khen</button>
        )}
      </div>
      <div className="space-y-6">
        {user.recommendations && user.recommendations.length > 0 ? (
          user.recommendations.map((rec) => (
            <div key={rec.id} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
              <Image src={rec.avatar} className="w-12 h-12 rounded-full object-cover flex-shrink-0" alt={rec.user} width={48} height={48} unoptimized />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-airbnb-dark">{rec.user}</h4>
                  <span className="text-[10px] text-airbnb-gray">• {rec.date}</span>
                </div>
                <p className="text-xs text-airbnb-gray mb-2">{rec.role}</p>
                <p className="text-sm text-airbnb-dark leading-relaxed italic">
                  {'\u201c'}
                  {rec.text}
                  {'\u201d'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-airbnb-gray italic">Chưa có lời khen ngợi nào.</p>
        )}
      </div>
    </div>
  );
};
