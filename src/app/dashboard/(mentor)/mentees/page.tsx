import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/roles';
import { MentorMenteesPage } from '@/views/mentor/MentorMenteesPage';

export default function DashboardMenteesPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
      <MentorMenteesPage />
    </ProtectedRoute>
  );
}
