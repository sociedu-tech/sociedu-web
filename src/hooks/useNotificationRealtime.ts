'use client';

import { useEffect, useRef } from 'react';
import { REALTIME_CHANNELS, realtimeEventBus } from '@/lib/realtime/eventBus';
import type { NotificationItem } from '@/services/notificationService';

type Options = {
  onNotification?: (item: NotificationItem) => void;
};

/**
 * Subscribe to in-app notification events from {@link GlobalRealtimeSubscriptions}.
 * Does not open a STOMP connection — use for UI widgets (inbox, badge, etc.).
 */
export function useNotificationRealtime({ onNotification }: Options) {
  const onNotificationRef = useRef(onNotification);
  onNotificationRef.current = onNotification;

  useEffect(() => {
    if (!onNotificationRef.current) return undefined;

    return realtimeEventBus.subscribe(REALTIME_CHANNELS.NOTIFICATION, (payload) => {
      onNotificationRef.current?.(payload as NotificationItem);
    });
  }, []);
}
