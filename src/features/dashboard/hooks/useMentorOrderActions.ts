'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildChatThreadUrl } from '@/features/dashboard/lib/directUserChat';
import { resolveOrderConversation } from '@/features/dashboard/lib/mentorOrderChat';
import type { MentorOrderRow } from '@/features/dashboard/hooks/useMentorOrders';
import { useToast } from '@/context/ToastContext';

export function useMentorOrderActions() {
  const router = useRouter();
  const toast = useToast();
  const [messagingId, setMessagingId] = useState<string | null>(null);

  const openChat = useCallback(
    async (order: MentorOrderRow) => {
      setMessagingId(order.id);
      try {
        const conversationId = await resolveOrderConversation(order);
        router.push(
          buildChatThreadUrl(conversationId, order.mentee, {
            contextType: 'order',
            contextId: order.id,
          }),
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Không mở được hội thoại.');
      } finally {
        setMessagingId(null);
      }
    },
    [router, toast],
  );

  return {
    messagingId,
    openChat,
  };
}
