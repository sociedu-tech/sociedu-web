import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/roles';
import { MentorRevenuePage } from '@/views/mentor/MentorRevenuePage';

export default function DashboardRevenuePage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
      <MentorRevenuePage />
    </ProtectedRoute>
  );
}
