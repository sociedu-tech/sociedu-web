'use client';

import React, { Suspense } from 'react';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { PAGE_LOADING_MIN_HEIGHT } from '@/lib/pageLoading';
import { useDashboardChatPage } from '@/features/dashboard/hooks';
import { DashboardChatPageView } from '@/features/dashboard/ui/DashboardChatPageView';

function DashboardChatPageContent() {
  const p = useDashboardChatPage();
  return <DashboardChatPageView {...p} />;
}

export function DashboardChatPage() {
  return (
    <Suspense
      fallback={
        <PageLoadingState label="Đang tải tin nhắn…" variant="chat" minHeight={PAGE_LOADING_MIN_HEIGHT} />
      }
    >
      <DashboardChatPageContent />
    </Suspense>
  );
}
