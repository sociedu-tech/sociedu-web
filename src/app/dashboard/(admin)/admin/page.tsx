import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ROLES } from '@/constants/roles';
import { AdminDashboard } from '@/views/admin/AdminDashboard';

export default function DashboardAdminPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
