import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/roles';
import { MentorSchedulePage } from '@/views/mentor/MentorSchedulePage';

export default function DashboardSchedulePage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
      <MentorSchedulePage />
    </ProtectedRoute>
  );
}
