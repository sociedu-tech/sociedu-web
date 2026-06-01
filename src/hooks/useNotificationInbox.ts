'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotificationRealtime } from '@/hooks/useNotificationRealtime';
import { filterActionNotifications, isActionNotification } from '@/lib/notificationFilter';
import { notificationService, type NotificationItem } from '@/services/notificationService';

export function useNotificationInbox() {
  const { isAuthenticated } = useAuth();

  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [page, count] = await Promise.all([
        notificationService.list(0, 30),
        notificationService.unreadCount(),
      ]);
      setItems(filterActionNotifications(page.items));
      setUnreadCount(count);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onRefresh = () => void refresh();
    window.addEventListener('notifications:refresh', onRefresh);
    return () => window.removeEventListener('notifications:refresh', onRefresh);
  }, [refresh]);

  useNotificationRealtime({
    onNotification: (item) => {
      if (!isActionNotification(item)) return;

      setItems((prev) => {
        const without = prev.filter((p) => p.id !== item.id);
        return [item, ...without];
      });
      if (!item.isRead) {
        setUnreadCount((c) => c + 1);
      }
    },
  });

  const markRead = useCallback(async (id: string) => {
    await notificationService.markRead(id);
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    await notificationService.markAllRead();
    const now = new Date().toISOString();
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: n.readAt ?? now })));
    setUnreadCount(0);
  }, []);

  return {
    items,
    unreadCount,
    loading,
    open,
    setOpen,
    refresh,
    markRead,
    markAllRead,
  };
}
