'use client';

import { useEffect, useRef } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useStomp } from '@/context/StompProvider';
import { chatPresence } from '@/lib/chatPresence';
import { chatUnreadStore } from '@/lib/chatUnreadStore';
import { parseConversationEvent } from '@/lib/realtime/parse';
import { conversationTopic } from '@/lib/realtime/topics';
import { chatService } from '@/services/chatService';

const MAX_CONVERSATION_PAGES = 5;
const CONV_PAGE_SIZE = 50;

/**
 * Subscribe to all user conversations for sidebar unread badge.
 * Chat messages are not shown in the notification bell.
 */
export function GlobalChatSubscriptions() {
  const { user, isAuthenticated } = useAuth();
  const { connected, subscribe } = useStomp();
  const userId = user?.id != null ? String(user.id) : null;
  const subsRef = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      subsRef.current.forEach((unsub) => unsub());
      subsRef.current.clear();
      chatUnreadStore.reset();
      chatPresence.setActive(null);
      return undefined;
    }

    let cancelled = false;

    const syncConversationSubscriptions = async () => {
      if (!connected) return;

      const ids: string[] = [];
      const unreadById: Record<string, number> = {};
      for (let page = 0; page < MAX_CONVERSATION_PAGES; page += 1) {
        try {
          const result = await chatService.listConversations(page, CONV_PAGE_SIZE);
          for (const c of result.items) {
            ids.push(c.id);
            unreadById[c.id] = c.unreadCount ?? 0;
          }
          if (page + 1 >= result.totalPages || result.items.length === 0) break;
        } catch {
          break;
        }
      }

      if (cancelled) return;

      chatUnreadStore.syncFromApi(unreadById);

      const nextIds = new Set(ids);
      const prev = subsRef.current;

      prev.forEach((unsub, id) => {
        if (!nextIds.has(id)) {
          unsub();
          prev.delete(id);
        }
      });

      nextIds.forEach((conversationId) => {
        if (prev.has(conversationId)) return;

        const unsub = subscribe(conversationTopic(conversationId), (body) => {
          const message = parseConversationEvent(body, conversationId);
          if (!message) return;
          if (String(message.senderId) === userId) return;
          if (chatPresence.onChatPage) return;
          if (chatPresence.activeConversationId === conversationId) return;
          chatUnreadStore.bump(conversationId);
        });
        prev.set(conversationId, unsub);
      });
    };

    void syncConversationSubscriptions();

    return () => {
      cancelled = true;
    };
  }, [connected, isAuthenticated, subscribe, userId]);

  useEffect(() => {
    return () => {
      subsRef.current.forEach((unsub) => unsub());
      subsRef.current.clear();
    };
  }, []);

  return null;
}
