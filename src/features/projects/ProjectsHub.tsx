'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { ProjectListUser } from '@/features/projects/ProjectList.user';
import { ProjectListMentor } from '@/features/projects/ProjectList.mentor';
import { ProjectListAdmin } from '@/features/projects/ProjectList.admin';

/**
 * Phân nhánh UI theo role (client — JWT hiện ở localStorage).
 * Khi có `getCurrentUser()` server + cookie, có thể bọc page bằng Server Component tương tự.
 */
export function ProjectsHub() {
  const { userRole } = useAuth();
  const r = normalizeRole(userRole);

  if (r === ROLES.ADMIN) {
    return <ProjectListAdmin />;
  }
  if (r === ROLES.MENTOR) {
    return <ProjectListMentor />;
  }
  return <ProjectListUser />;
}
