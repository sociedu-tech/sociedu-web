import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/roles';
import { MentorPackagesPage } from '@/views/mentor/MentorPackagesPage';

export default function DashboardPackagesPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
      <MentorPackagesPage />
    </ProtectedRoute>
  );
}
