'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageLoadingState } from '@/components/ui/PageLoadingState';

/** Waits for auth session before rendering role-based children (avoids GUEST flash). */
export function AuthRoleGate({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return <PageLoadingState label="Đang tải tài khoản…" />;
  }

  return <>{children}</>;
}
