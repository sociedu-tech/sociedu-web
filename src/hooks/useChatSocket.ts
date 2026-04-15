import { useCallback, useState } from 'react';
import { useWsChannel } from '@/hooks/useWsChannel';
import { useWebSocket } from '@/hooks/useWebSocket';

export interface ChatSocketMessage {
  conversationId: string | number;
  senderId: string | number;
  content: string;
  createdAt?: string;
  [key: string]: unknown;
}

export function useChatSocket(conversationId?: string | number) {
  const { send } = useWebSocket();
  const [messages, setMessages] = useState<ChatSocketMessage[]>([]);

  useWsChannel<ChatSocketMessage>('chat', (message) => {
    if (!conversationId || message.conversationId === conversationId) {
      setMessages((prev) => [...prev, message]);
    }
  });

  const joinConversation = useCallback(
    (targetConversationId: string | number) => {
      send({
        action: 'subscribe',
        channel: 'chat',
        conversationId: targetConversationId,
      });
    },
    [send],
  );

  const sendMessage = useCallback(
    (payload: Omit<ChatSocketMessage, 'createdAt'>) => {
      return send({
        action: 'publish',
        channel: 'chat',
        payload,
      });
    },
    [send],
  );

  return {
    messages,
    joinConversation,
    sendMessage,
  };
}
