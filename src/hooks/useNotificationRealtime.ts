'use client';

import { useEffect, useRef } from 'react';
import { useStomp } from '@/context/StompProvider';
import { notificationTopicForUser } from '@/lib/wsConfig';
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
  const { connected, subscribe } = useStomp();
  const onNotificationRef = useRef(onNotification);
  onNotificationRef.current = onNotification;

  useEffect(() => {
    if (!connected || !userId) return undefined;

    const destination = notificationTopicForUser(userId);
    const unsubscribe = subscribe(destination, (body) => {
      try {
        const envelope = JSON.parse(body) as NotificationEnvelope;
        if (envelope.eventType !== 'NEW_NOTIFICATION' || !envelope.payload) {
          return;
        }
        onNotificationRef.current?.(envelope.payload);
      } catch {
        // ignore malformed frames
      }
    });

    return unsubscribe;
  }, [connected, subscribe, userId]);
}
