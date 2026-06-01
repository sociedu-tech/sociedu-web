'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/roles';
import { MentorPayoutCreatePage } from '@/features/mentor/views/MentorPayoutPages';

export default function DashboardPayoutCreatePage() {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
        <MentorPayoutCreatePage />
      </ProtectedRoute>
    </div>
  );
}
