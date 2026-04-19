import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/roles';
import { MentorProjectOpportunitiesPage } from '@/views/dashboard/MentorProjectOpportunitiesPage';

export default function DashboardMentorOpportunitiesPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
      <MentorProjectOpportunitiesPage />
    </ProtectedRoute>
  );
}
