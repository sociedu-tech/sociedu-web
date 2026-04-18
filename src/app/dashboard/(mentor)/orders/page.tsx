import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/roles';
import { MentorOrdersPage } from '@/views/mentor/MentorOrdersPage';

export default function DashboardOrdersPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
      <MentorOrdersPage />
    </ProtectedRoute>
  );
}
