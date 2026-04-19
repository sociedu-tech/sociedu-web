'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = { projectId: string };

export function ProjectDetailUser({ projectId }: Props) {
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
        <h2 className="text-lg font-bold text-dark">Chi tiết dự án (học viên)</h2>
        <p className="mt-2 text-sm text-gray">ID: {projectId}</p>
        <p className="mt-4 text-[15px] leading-relaxed text-gray">
          Nội dung chi tiết, tiến độ và tài liệu sẽ nối API sau.
        </p>
      </div>
    </div>
  );
}
