'use client';

import React from 'react';
import { useDashboardChatPage } from '@/features/dashboard/hooks';
import { DashboardChatPageView } from '@/features/dashboard/ui/DashboardChatPageView';

export type { ChatAttachment } from '@/features/dashboard/chat/types';

export function DashboardChatPage() {
  const p = useDashboardChatPage();
  return <DashboardChatPageView {...p} />;
}
