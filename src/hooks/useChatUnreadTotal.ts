'use client';

import { useSyncExternalStore } from 'react';
import { chatUnreadStore } from '@/lib/chatUnreadStore';

export function useChatUnreadTotal(): number {
  return useSyncExternalStore(
    chatUnreadStore.subscribe,
    chatUnreadStore.getTotal,
    () => 0,
  );
}
