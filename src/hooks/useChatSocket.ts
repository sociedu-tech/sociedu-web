import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';
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
      webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws-chat?token=${encodeURIComponent(token)}`),
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
        try {
          const parsed = JSON.parse(frame.body) as Omit<ChatSocketMessage, 'conversationId'>;
          handler({ ...parsed, conversationId });
        } catch {
          // Ignore malformed payload so stream stays alive.
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
