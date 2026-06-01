'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { resolveNotificationUrl } from '@/lib/notificationRouter';
import type { NotificationItem } from '@/services/notificationService';

type NavigateOptions = {
  markRead?: (id: string) => Promise<void>;
  onClose?: () => void;
};

export function useNotificationNavigation() {
  const router = useRouter();
  const { userRole } = useAuth();
  const toast = useToast();

  const navigateFromNotification = useCallback(
    async (item: NotificationItem, options?: NavigateOptions) => {
      const url = resolveNotificationUrl(item, userRole);
      if (!url) {
        toast.error('Không mở được trang chi tiết cho thông báo này.');
        return false;
      }

      options?.onClose?.();

      if (options?.markRead && !item.isRead) {
        await options.markRead(item.id);
      }

      router.push(url);
      return true;
    },
    [router, toast, userRole],
  );

  return { navigateFromNotification, resolveUrl: (item: NotificationItem) => resolveNotificationUrl(item, userRole) };
}
