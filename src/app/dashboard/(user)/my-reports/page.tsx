import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserReportsPage } from '@/features/report/views/UserReportsPage';

export default function MyReportsRoute() {
  return (
    <ProtectedRoute>
      <UserReportsPage />
    </ProtectedRoute>
  );
}
