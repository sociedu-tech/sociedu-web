'use client';

import { useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useStomp } from '@/context/StompProvider';
import { REALTIME_CHANNELS, realtimeEventBus } from '@/lib/realtime/eventBus';
import { parseNotificationEvent } from '@/lib/realtime/parse';
import { normalizeNotificationItem } from '@/lib/notificationItem';
import { userNotificationsTopic } from '@/lib/realtime/topics';
import { fireNotificationToast } from '@/components/dashboard/NotificationToast';
import { isActionNotification } from '@/lib/notificationFilter';
import type { NotificationItem } from '@/services/notificationService';

/**
 * App-wide STOMP bindings: one subscription per domain channel, fan-out via event bus.
 * Mount once under {@link StompProvider} (see providers.tsx).
 */
export function GlobalRealtimeSubscriptions() {
  const { user, isAuthenticated } = useAuth();
  const { connected, subscribe } = useStomp();
  const userId = user?.id != null ? String(user.id) : null;

  useEffect(() => {
    if (!connected || !isAuthenticated || !userId) return undefined;

    const destination = userNotificationsTopic(userId);
    return subscribe(destination, (body) => {
      const payload = parseNotificationEvent(body);
      if (!payload) return;

      const item = normalizeNotificationItem(payload);
      realtimeEventBus.emit(REALTIME_CHANNELS.NOTIFICATION, item);
      if (isActionNotification(item)) {
        fireNotificationToast(item);
      }
    });
  }, [connected, isAuthenticated, subscribe, userId]);

  return null;
}
