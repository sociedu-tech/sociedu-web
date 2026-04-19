import { Suspense } from 'react';
import { ProjectsHub } from '@/views/dashboard/projects/ProjectsHub';

export default function DashboardProjectsPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-600">Đang tải…</div>}>
      <ProjectsHub />
    </Suspense>
  );
}
