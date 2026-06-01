'use client';

import React, { Suspense } from 'react';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { useDashboardChatPage } from '@/features/dashboard/hooks';
import { DashboardChatPageView } from '@/features/dashboard/ui/DashboardChatPageView';

export type { ChatAttachment } from '@/features/dashboard/chat/types';

function DashboardChatPageContent() {
  const p = useDashboardChatPage();

  if (p.loading && p.conversations.length === 0) {
    return <PageLoadingState label="Đang tải tin nhắn…" variant="chat" minHeight="min-h-[480px]" />;
  }

  return (
    <DashboardChatPageView
      active={p.active}
      filtered={p.filtered}
      activeId={p.activeId}
      draft={p.draft}
      setDraft={p.setDraft}
      query={p.query}
      setQuery={p.setQuery}
      mobileThread={p.mobileThread}
      setMobileThread={p.setMobileThread}
      rightPanelOpen={p.rightPanelOpen}
      setRightPanelOpen={p.setRightPanelOpen}
      bottomRef={p.bottomRef}
      sharedImages={p.sharedImages}
      sharedFiles={p.sharedFiles}
      openThread={p.openThread}
      send={p.send}
      convPage={p.convPage}
      convSize={p.convSize}
      convTotal={p.convTotal}
      convTotalPages={p.convTotalPages}
      onConvPageChange={p.setConvPage}
      onConvSizeChange={p.setConvSize}
      convLoading={p.loading}
      pendingMessageContext={p.pendingMessageContext}
    />
  );
}

export function DashboardChatPage() {
  return (
    <Suspense fallback={<PageLoadingState label="Đang tải tin nhắn…" variant="chat" minHeight="min-h-[480px]" />}>
      <DashboardChatPageContent />
    </Suspense>
  );
}
