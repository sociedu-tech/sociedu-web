import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/roles';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.MENTOR, ROLES.ADMIN]}>
      {children}
    </ProtectedRoute>
  );
}
