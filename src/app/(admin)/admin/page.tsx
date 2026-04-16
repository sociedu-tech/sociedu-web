import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminDashboard } from '@/views/AdminDashboard';

export default function AdminRoute() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
