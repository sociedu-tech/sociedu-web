import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/roles';

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
      {children}
    </ProtectedRoute>
  );
}
