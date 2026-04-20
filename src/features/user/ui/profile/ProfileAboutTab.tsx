import React from 'react';
import { motion } from 'motion/react';
import { Award } from 'lucide-react';
import type { User as UserType } from '@/types';

interface ProfileAboutTabProps {
  user: UserType;
}

export const ProfileAboutTab = ({ user }: ProfileAboutTabProps) => {
  return (
    <motion.div 
      key="about"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-airbnb-dark mb-4">Mô tả bản thân</h2>
        <p className="text-airbnb-dark leading-relaxed whitespace-pre-line">
          {user.bio || "Chưa có thông tin giới thiệu."}
        </p>
      </div>

      {user.skills && user.skills.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-airbnb-dark mb-4">Kỹ năng nổi bật</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, i) => (
              <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {user.achievements && user.achievements.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-airbnb-dark mb-4">Thành tựu</h2>
          <div className="space-y-3">
            {user.achievements.map((achievement, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                <Award className="text-yellow-600" size={20} />
                <span className="text-sm font-bold text-yellow-800">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
