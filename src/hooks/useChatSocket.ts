import { useCallback, useEffect, useRef } from 'react';
import { useStomp } from '@/context/StompProvider';

export interface ChatSocketMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type?: string;
  attachmentFileIds?: string[] | null;
  edited?: boolean;
  createdAt?: string;
  [key: string]: unknown;
}

type MessageHandler = (message: ChatSocketMessage) => void;

function parseConversationEvent(body: string, fallbackConversationId: string): ChatSocketMessage | null {
  try {
    const raw = JSON.parse(body) as Record<string, unknown>;
    const payload =
      raw.payload && typeof raw.payload === 'object' && !Array.isArray(raw.payload)
        ? (raw.payload as Record<string, unknown>)
        : raw;

    const id = payload.id ?? raw.id;
    const senderId = payload.senderId ?? raw.senderId;
    if (id == null || senderId == null) {
      return null;
    }

    const attachmentFileIds = payload.attachmentFileIds ?? raw.attachmentFileIds;

    return {
      id: String(id),
      conversationId: String(payload.conversationId ?? raw.conversationId ?? fallbackConversationId),
      senderId: String(senderId),
      content: String(payload.content ?? raw.content ?? ''),
      type: payload.type != null ? String(payload.type) : raw.type != null ? String(raw.type) : undefined,
      edited:
        typeof payload.edited === 'boolean'
          ? payload.edited
          : typeof raw.edited === 'boolean'
            ? raw.edited
            : undefined,
      createdAt:
        payload.createdAt != null
          ? String(payload.createdAt)
          : raw.createdAt != null
            ? String(raw.createdAt)
            : undefined,
      attachmentFileIds: Array.isArray(attachmentFileIds)
        ? attachmentFileIds.map((fileId) => String(fileId))
        : null,
      contextType:
        payload.contextType != null
          ? String(payload.contextType)
          : raw.contextType != null
            ? String(raw.contextType)
            : undefined,
      contextId:
        payload.contextId != null
          ? String(payload.contextId)
          : raw.contextId != null
            ? String(raw.contextId)
            : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Hook to subscribe to a set of conversation topics via the shared STOMP
 * connection.  The `onMessage` callback is stored in a ref so it can change
 * without causing re-subscriptions.
 *
 * @param conversationIds — array of conversation UUIDs to subscribe
 * @param onMessage       — callback invoked for every incoming message
 */
export function useChatSubscriptions(
  conversationIds: string[],
  onMessage: (conversationId: string, message: ChatSocketMessage) => void,
) {
  const { connected, subscribe } = useStomp();
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  // Track currently-subscribed IDs to do diff-based subscribe/unsubscribe
  const activeSubsRef = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    if (!connected) return;

    const currentIds = new Set(conversationIds);
    const prevMap = activeSubsRef.current;

    // Unsubscribe conversations that are no longer in the list
    prevMap.forEach((unsub, id) => {
      if (!currentIds.has(id)) {
        unsub();
        prevMap.delete(id);
      }
    });

    // Subscribe new conversations
    currentIds.forEach((id) => {
      if (prevMap.has(id)) return; // already subscribed

      const unsub = subscribe(`/topic/conversations/${id}`, (body) => {
        const message = parseConversationEvent(body, id);
        if (message) {
          onMessageRef.current(id, message);
        }
      });
      prevMap.set(id, unsub);
    });
  }, [connected, conversationIds, subscribe]);

  // Cleanup all subscriptions on unmount
  useEffect(() => {
    return () => {
      activeSubsRef.current.forEach((unsub) => unsub());
      activeSubsRef.current.clear();
    };
  }, []);

  return { connected };
}

/**
 * @deprecated Use `useChatSubscriptions` instead. This hook is kept for
 * backward compatibility but now delegates to StompProvider.
 */
export function useChatSocket() {
  const { connected, subscribe } = useStomp();

  const subscribeConversation = useCallback(
    (conversationId: string, handler: MessageHandler) => {
      return subscribe(`/topic/conversations/${conversationId}`, (body) => {
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
