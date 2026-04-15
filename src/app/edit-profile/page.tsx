import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { EditProfilePage } from '@/views/EditProfilePage';

export default function EditProfileRoute() {
  return (
    <ProtectedRoute>
      <EditProfilePage />
    </ProtectedRoute>
  );
}
