import { useCallback, useEffect, useRef } from 'react';
import { useStomp } from '@/context/StompProvider';
import { conversationTopic } from '@/lib/realtime/topics';
import { parseConversationEvent, type ChatSocketMessage } from '@/lib/realtime/parse';

export type { ChatSocketMessage } from '@/lib/realtime/parse';

type MessageHandler = (message: ChatSocketMessage) => void;

/**
 * Subscribe to conversation topics via the shared STOMP connection.
 * Topic registry deduplicates STOMP subs when multiple handlers share a conversation.
 */
export function useChatSubscriptions(
  conversationIds: string[],
  onMessage: (conversationId: string, message: ChatSocketMessage) => void,
) {
  const { connected, subscribe } = useStomp();
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const activeSubsRef = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    if (!connected) return;

    const currentIds = new Set(conversationIds);
    const prevMap = activeSubsRef.current;

    prevMap.forEach((unsub, id) => {
      if (!currentIds.has(id)) {
        unsub();
        prevMap.delete(id);
      }
    });

    currentIds.forEach((id) => {
      if (prevMap.has(id)) return;

      const unsub = subscribe(conversationTopic(id), (body) => {
        const message = parseConversationEvent(body, id);
        if (message) {
          onMessageRef.current(id, message);
        }
      });
      prevMap.set(id, unsub);
    });
  }, [connected, conversationIds, subscribe]);

  useEffect(() => {
    return () => {
      activeSubsRef.current.forEach((unsub) => unsub());
      activeSubsRef.current.clear();
    };
  }, []);

  return { connected };
}

/** @deprecated Prefer {@link useChatSubscriptions} */
export function useChatSocket() {
  const { connected, subscribe } = useStomp();

  const subscribeConversation = useCallback(
    (conversationId: string, handler: MessageHandler) => {
      return subscribe(conversationTopic(conversationId), (body) => {
        const message = parseConversationEvent(body, conversationId);
        if (message) {
          handler(message);
        }
      });
    },
    [subscribe],
  );

  return { connected, subscribeConversation };
}
