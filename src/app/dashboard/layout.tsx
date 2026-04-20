'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardShell } from '@/features/dashboard/ui/DashboardShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
