'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = { projectId: string };

export function ProjectDetailMentor({ projectId }: Props) {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="size-4" />
        Quay lại danh sách
      </Link>
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-dark">Chi tiết dự án (mentor)</h2>
        <p className="mt-2 text-sm text-gray">ID: {projectId}</p>
        <p className="mt-4 text-[15px] leading-relaxed text-gray">
          Ghi chú, đánh giá và lịch buổi học liên quan — tích hợp API sau.
        </p>
      </div>
    </div>
  );
}
