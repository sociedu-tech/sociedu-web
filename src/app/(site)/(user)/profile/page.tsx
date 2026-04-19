'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

function ProfileWelcome() {
  const { userRole } = useAuth();
  return (
    <div className='max-w-7xl mx-auto px-4 py-20 text-center'>
      <h2 className='text-2xl font-bold text-airbnb-dark'>
        Chào mừng bạn quay trở lại!
      </h2>
      <p className='text-airbnb-gray mt-2'>
        Bạn đang đăng nhập với vai trò{' '}
        <span className='font-bold text-airbnb-red'>{userRole}</span>.
      </p>
    </div>
  );
}

export default function ProfileIndexPage() {
  return (
    <ProtectedRoute>
      <ProfileWelcome />
    </ProtectedRoute>
  );
}
