'use client';

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { useDashboardChatPage } from '@/features/dashboard/hooks';
import { DashboardChatPageView } from '@/features/dashboard/ui/DashboardChatPageView';

export type { ChatAttachment } from '@/features/dashboard/chat/types';

function DashboardChatPageContent() {
  const p = useDashboardChatPage();
  return <DashboardChatPageView {...p} />;
}

export function DashboardChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-500">
          <Loader2 className="size-5 animate-spin" />
          Đang tải tin nhắn…
        </div>
      }
    >
      <DashboardChatPageContent />
    </Suspense>
  );
}
