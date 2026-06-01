'use client';

import React, { Suspense } from 'react';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { useDashboardChatPage } from '@/features/dashboard/hooks';
import { DashboardChatPageView } from '@/features/dashboard/ui/DashboardChatPageView';
import { useAuth } from '@/context/AuthContext';

export type { ChatAttachment } from '@/features/dashboard/chat/types';

function DashboardChatPageContent() {
  const p = useDashboardChatPage();
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';
  return <DashboardChatPageView {...p} isAdmin={isAdmin} />;
}

export function DashboardChatPage() {
  return (
    <Suspense fallback={<PageLoadingState label="Đang tải tin nhắn…" variant="chat" minHeight="min-h-[480px]" />}>
      <DashboardChatPageContent />
    </Suspense>
  );
}
