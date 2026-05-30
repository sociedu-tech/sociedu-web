import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, GraduationCap } from 'lucide-react';
import type { User as UserType } from '@/types';

interface ProfileExperienceTabProps {
  user: UserType;
}

function TimelineItem({
  icon: Icon,
  title,
  subtitle,
  meta,
  description,
}: {
  icon: typeof Briefcase;
  title: string;
  subtitle?: string;
  meta?: string;
  description?: string;
}) {
  return (
    <li className="relative flex gap-4 pb-8 last:pb-0">
      <div className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-xl border border-marketing-border bg-marketing-canvas text-indigo-600">
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 border-b border-marketing-border pb-8 last:border-0 last:pb-0">
        <h3 className="font-bold text-marketing-fg">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-sm font-medium text-marketing-fg-strong">{subtitle}</p> : null}
        {meta ? <p className="mt-1 text-xs text-marketing-fg-muted">{meta}</p> : null}
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-marketing-body">{description}</p>
        ) : null}
      </div>
    </li>
  );
}

export const ProfileExperienceTab = ({ user }: ProfileExperienceTabProps) => {
  const hasExperience = user.experience && user.experience.length > 0;
  const hasEducation = user.educations && user.educations.length > 0;

  return (
    <motion.div
      key="experience"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="space-y-10"
    >
      <section>
        <h2 className="flex items-center gap-2 text-lg font-bold text-marketing-fg">
          <Briefcase className="size-5 text-indigo-600" aria-hidden />
          Kinh nghiệm làm việc
        </h2>
        {hasExperience ? (
          <ol className="relative mt-6 space-y-0 pl-1 before:absolute before:bottom-2 before:left-[21px] before:top-2 before:w-px before:bg-marketing-border">
            {user.experience!.map((exp, i) => (
              <TimelineItem
                key={i}
                icon={Briefcase}
                title={exp.role}
                subtitle={exp.company}
                meta={exp.duration}
                description={exp.description}
              />
            ))}
          </ol>
        ) : (
          <p className="mt-4 text-sm italic text-marketing-fg-muted">Chưa có thông tin kinh nghiệm.</p>
        )}
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-lg font-bold text-marketing-fg">
          <GraduationCap className="size-5 text-indigo-600" aria-hidden />
          Học vấn
        </h2>
        {hasEducation ? (
          <ol className="relative mt-6 space-y-0 pl-1 before:absolute before:bottom-2 before:left-[21px] before:top-2 before:w-px before:bg-marketing-border">
            {user.educations!.map((edu, i) => (
              <TimelineItem
                key={i}
                icon={GraduationCap}
                title={edu.university}
                subtitle={edu.major}
                meta={edu.year ? `Năm ${edu.year}` : undefined}
                description={
                  edu.gpa ? `GPA: ${edu.gpa}` : undefined
                }
              />
            ))}
          </ol>
        ) : (
          <p className="mt-4 text-sm italic text-marketing-fg-muted">Chưa có thông tin học vấn.</p>
        )}
      </section>
    </motion.div>
  );
};
