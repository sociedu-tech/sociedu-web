import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserReportsPage } from '@/views/UserReportsPage';

export default function MyReportsRoute() {
  return (
    <ProtectedRoute>
      <UserReportsPage />
    </ProtectedRoute>
  );
}
