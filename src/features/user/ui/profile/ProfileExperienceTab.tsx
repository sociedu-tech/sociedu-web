import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, GraduationCap } from 'lucide-react';
import type { User as UserType } from '@/types';

interface ProfileExperienceTabProps {
  user: UserType;
}

export const ProfileExperienceTab = ({ user }: ProfileExperienceTabProps) => {
  return (
    <motion.div 
      key="experience"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-xl font-bold text-airbnb-dark mb-6 flex items-center gap-2">
          <Briefcase size={24} className="text-blue-600" /> Kinh nghiệm làm việc
        </h2>
        <div className="space-y-8">
          {user.experience && user.experience.length > 0 ? (
            user.experience.map((exp, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="text-airbnb-gray" size={24} />
                </div>
                <div className="flex-1 pb-6 border-b border-gray-100 last:border-0">
                  <h3 className="font-bold text-airbnb-dark">{exp.role}</h3>
                  <p className="text-sm text-airbnb-dark">{exp.company}</p>
                  <p className="text-xs text-airbnb-gray mt-1">{exp.duration}</p>
                  <p className="text-sm text-airbnb-gray mt-3 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-airbnb-gray italic">Chưa có thông tin kinh nghiệm.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-airbnb-dark mb-6 flex items-center gap-2">
          <GraduationCap size={24} className="text-blue-600" /> Học vấn
        </h2>
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="text-airbnb-gray" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-airbnb-dark">{user.university || "Chưa cập nhật trường học"}</h3>
            <p className="text-sm text-airbnb-dark">{user.major || "Chưa cập nhật ngành học"}</p>
            {user.year && <p className="text-xs text-airbnb-gray mt-1">Năm {user.year}</p>}
            {user.gpa && (
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded">
                GPA: {user.gpa}/4.0
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
