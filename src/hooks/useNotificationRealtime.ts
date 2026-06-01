'use client';

import { Client, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { buildSockJsChatUrl, notificationTopicForUser } from '@/lib/wsConfig';
import type { NotificationItem } from '@/services/notificationService';

type NotificationEnvelope = {
  eventType?: string;
  serverTimestamp?: string;
  payload?: NotificationItem;
};

type Options = {
  userId?: string | null;
  onNotification?: (item: NotificationItem) => void;
};

export function useNotificationRealtime({ userId, onNotification }: Options) {
  const { token, isAuthenticated } = useAuth();
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const onNotificationRef = useRef(onNotification);

  onNotificationRef.current = onNotification;

  const disconnect = useCallback(() => {
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null;
    clientRef.current?.deactivate();
    clientRef.current = null;
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !token || !userId) {
      disconnect();
      return undefined;
    }

    const client = new Client({
      reconnectDelay: 4000,
      webSocketFactory: () => new SockJS(buildSockJsChatUrl(token)),
    });

    client.onConnect = () => {
      const destination = notificationTopicForUser(userId);
      subscriptionRef.current = client.subscribe(destination, (frame) => {
        try {
          const envelope = JSON.parse(frame.body) as NotificationEnvelope;
          if (envelope.eventType !== 'NEW_NOTIFICATION' || !envelope.payload) {
            return;
          }
          onNotificationRef.current?.(envelope.payload);
        } catch {
          // ignore malformed frames
        }
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      disconnect();
    };
  }, [disconnect, isAuthenticated, token, userId]);
}
