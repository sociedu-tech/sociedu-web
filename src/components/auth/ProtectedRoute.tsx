'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PageLoadingState } from '@/components/ui/PageLoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, userRole, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    } else if (allowedRoles && !allowedRoles.includes(userRole)) {
      router.replace('/dashboard');
    }
  }, [loading, isAuthenticated, userRole, allowedRoles, router, pathname]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <PageLoadingState minHeight="min-h-screen" />
      </div>
    );
  }

  if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(userRole))) {
    return (
      <div className="flex min-h-[100dvh] w-full items-center justify-center bg-slate-50">
        <PageLoadingState label="Đang chuyển hướng…" minHeight="min-h-0" />
      </div>
    );
  }

  return <>{children}</>;
}
