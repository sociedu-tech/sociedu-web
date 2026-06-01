import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { buildSockJsChatUrl } from '@/lib/wsConfig';
import { useAuth } from '@/context/AuthContext';

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
      conversationId: String(raw.conversationId ?? fallbackConversationId),
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
    };
  } catch {
    return null;
  }
}

export function useChatSocket() {
  const { token, isAuthenticated } = useAuth();
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, StompSubscription>>(new Map());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setConnected(false);
      return undefined;
    }

    const client = new Client({
      reconnectDelay: 3000,
      webSocketFactory: () => new SockJS(buildSockJsChatUrl(token)),
    });
    client.onConnect = () => {
      setConnected(true);
    };
    client.onDisconnect = () => {
      setConnected(false);
    };
    client.onWebSocketClose = () => {
      setConnected(false);
    };
    client.activate();
    clientRef.current = client;
    const activeSubscriptions = subscriptionsRef.current;

    return () => {
      activeSubscriptions.forEach((sub) => sub.unsubscribe());
      activeSubscriptions.clear();
      client.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [isAuthenticated, token]);

  const subscribeConversation = useCallback((conversationId: string, handler: MessageHandler) => {
    const client = clientRef.current;
    if (!client || !client.connected || subscriptionsRef.current.has(conversationId)) {
      return () => {};
    }

    const subscription = client.subscribe(
      `/topic/conversations/${conversationId}`,
      (frame: IMessage) => {
        const message = parseConversationEvent(frame.body, conversationId);
        if (message) {
          handler(message);
        }
      },
    );

    subscriptionsRef.current.set(conversationId, subscription);
    return () => {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(conversationId);
    };
  }, []);

  const publishMessage = useCallback((payload: {
    conversationId: string;
    content: string;
    type?: string;
    attachmentFileIds?: string[];
  }) => {
    const client = clientRef.current;
    if (!client || !client.connected) {
      return false;
    }
    client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(payload),
    });
    return true;
  }, []);

  return {
    connected,
    subscribeConversation,
    publishMessage,
  };
}
