'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { ProjectDetailUser } from '@/views/dashboard/projects/ProjectDetail.user';
import { ProjectDetailMentor } from '@/views/dashboard/projects/ProjectDetail.mentor';
import { ProjectDetailAdmin } from '@/views/dashboard/projects/ProjectDetail.admin';

type Props = { projectId: string };

export function ProjectsDetailHub({ projectId }: Props) {
  const { userRole } = useAuth();
  const r = normalizeRole(userRole);

  if (r === ROLES.ADMIN) {
    return <ProjectDetailAdmin projectId={projectId} />;
  }
  if (r === ROLES.MENTOR) {
    return <ProjectDetailMentor projectId={projectId} />;
  }
  return <ProjectDetailUser projectId={projectId} />;
}
