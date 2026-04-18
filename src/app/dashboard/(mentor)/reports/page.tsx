import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/roles';
import { MentorReportsPage } from '@/views/mentor/MentorReportsPage';

export default function DashboardReportsPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
      <MentorReportsPage />
    </ProtectedRoute>
  );
}
