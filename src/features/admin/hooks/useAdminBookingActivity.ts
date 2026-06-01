'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotificationRealtime } from '@/hooks/useNotificationRealtime';
import { notificationService, type NotificationItem } from '@/services/notificationService';

const MAX_ITEMS = 10;

function isBookingNotification(item: NotificationItem): boolean {
  const type = item.type?.toUpperCase();
  const ref = item.referenceType?.toLowerCase();
  return type === 'BOOKING' || ref === 'booking' || ref === 'booking_session';
}

/**
 * Hook lọc notification loại BOOKING cho admin activity feed.
 * Fetch lần đầu + real-time subscription.
 */
export function useAdminBookingActivity() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const page = await notificationService.list(0, 50);
      setItems(page.items.filter(isBookingNotification).slice(0, MAX_ITEMS));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Real-time: thêm mục mới vào đầu danh sách khi có booking notification
  useNotificationRealtime({
    onNotification: (item) => {
      if (!isBookingNotification(item)) return;
      setItems((prev) => {
        const without = prev.filter((p) => p.id !== item.id);
        return [item, ...without].slice(0, MAX_ITEMS);
      });
    },
  });

  return { items, loading, refresh };
}
