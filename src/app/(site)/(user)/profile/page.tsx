'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function ProfileRedirect() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && user?.id != null) {
      router.replace(`/profile/${user.id}`);
      return;
    }
    router.replace('/mentors');
  }, [isLoading, isAuthenticated, user?.id, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-marketing-canvas">
      <LoadingSpinner size={40} label="Đang chuyển hướng..." />
    </div>
  );
}

export default function ProfileIndexPage() {
  return (
    <ProtectedRoute>
      <ProfileRedirect />
    </ProtectedRoute>
  );
}
