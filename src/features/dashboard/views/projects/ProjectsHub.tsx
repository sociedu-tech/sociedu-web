'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { ProjectListUser } from '@/features/dashboard/views/projects/ProjectList.user';
import { ProjectListMentor } from '@/features/dashboard/views/projects/ProjectList.mentor';
import { ProjectListAdmin } from '@/features/dashboard/views/projects/ProjectList.admin';

export function ProjectsHub() {
  const { userRole } = useAuth();
  const r = normalizeRole(userRole);

  const header =
    r === ROLES.ADMIN
      ? {
          eyebrow: 'Quản trị' as const,
          title: 'Dự án trên hệ thống',
          description: 'Giám sát tiến độ và cặp học viên — mentor (dữ liệu mẫu).',
        }
      : r === ROLES.MENTOR
        ? {
            eyebrow: 'Mentor' as const,
            title: 'Dự án đồng hành',
            description: 'Các dự án bạn đang hỗ trợ cùng học viên.',
          }
        : {
            eyebrow: 'Học viên' as const,
            title: 'Dự án của bạn',
            description: 'Danh sách dự án / gói bạn đang tham gia cùng mentor.',
          };

  const action =
    r === ROLES.USER ? (
      <Link
        href="/dashboard/projects/new"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        <Plus className="size-4" strokeWidth={2.5} />
        Tạo dự án mới
      </Link>
    ) : undefined;

  return (
    <div className="space-y-6 pb-2">
      <DashboardViewHeader {...header} action={action} layout="compact" />
      {r === ROLES.ADMIN ? (
        <ProjectListAdmin />
      ) : r === ROLES.MENTOR ? (
        <ProjectListMentor />
      ) : (
        <ProjectListUser />
      )}
    </div>
  );
}
