'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/roles';

export default function AdminSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      {children}
    </ProtectedRoute>
  );
}
