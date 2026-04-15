import { useCallback, useState } from 'react';
import { useWsChannel } from '@/hooks/useWsChannel';
import { useWebSocket } from '@/hooks/useWebSocket';

export interface NotificationEvent {
  id?: string;
  title?: string;
  message?: string;
  createdAt?: string;
  read?: boolean;
  [key: string]: unknown;
}

export function useNotifications() {
  const { send } = useWebSocket();
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);

  useWsChannel<NotificationEvent>('notification', (event) => {
    setNotifications((prev) => [event, ...prev]);
  });

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const subscribeNotifications = useCallback(() => {
    send({ action: 'subscribe', channel: 'notification' });
  }, [send]);

  return {
    notifications,
    markRead,
    clearAll,
    subscribeNotifications,
  };
}
