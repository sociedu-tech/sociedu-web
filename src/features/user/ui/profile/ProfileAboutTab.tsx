import React from 'react';
import { motion } from 'motion/react';
import { Award, Sparkles } from 'lucide-react';
import type { User as UserType } from '@/types';

interface ProfileAboutTabProps {
  user: UserType;
}

export const ProfileAboutTab = ({ user }: ProfileAboutTabProps) => {
  const hasSkills = user.skills && user.skills.length > 0;
  const hasAchievements = user.achievements && user.achievements.length > 0;

  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      <section>
        <h2 className="flex items-center gap-2 text-lg font-bold text-marketing-fg">
          <Sparkles className="size-5 text-indigo-600" aria-hidden />
          Mô tả bản thân
        </h2>
        <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-marketing-body">
          {user.bio?.trim() || 'Chưa có thông tin giới thiệu.'}
        </p>
      </section>

      {hasSkills ? (
        <section>
          <h2 className="text-lg font-bold text-marketing-fg">Kỹ năng nổi bật</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {user.skills!.map((skill, i) => (
              <span
                key={i}
                className="rounded-xl border border-indigo-100 bg-indigo-50/80 px-3.5 py-2 text-sm font-semibold text-indigo-900"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {hasAchievements ? (
        <section>
          <h2 className="text-lg font-bold text-marketing-fg">Thành tựu</h2>
          <ul className="mt-4 space-y-3">
            {user.achievements!.map((achievement, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3"
              >
                <Award className="size-5 shrink-0 text-amber-600" aria-hidden />
                <span className="text-sm font-semibold text-amber-950">{achievement}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </motion.div>
  );
};
