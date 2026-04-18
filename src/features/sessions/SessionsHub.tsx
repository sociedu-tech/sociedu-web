'use client';

import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { SessionsListUser } from '@/features/sessions/SessionsList.user';
import { SessionsListMentor } from '@/features/sessions/SessionsList.mentor';
import { SessionsListAdmin } from '@/features/sessions/SessionsList.admin';

export function SessionsHub() {
  const { userRole } = useAuth();
  const r = normalizeRole(userRole);

  if (r === ROLES.ADMIN) {
    return <SessionsListAdmin />;
  }
  if (r === ROLES.MENTOR) {
    return <SessionsListMentor />;
  }
  return <SessionsListUser />;
}
