'use client';

import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { useNotificationInbox } from '@/hooks/useNotificationInbox';
import { useAuth } from '@/context/AuthContext';
import { resolveNotificationUrl } from '@/lib/notificationRouter';
import { NotificationTypeIcon, notificationRelativeTime } from '@/lib/notificationUi';
import { cn } from '@/lib/utils';
import type { NotificationItem } from '@/services/notificationService';

export function NotificationBell() {
  const router = useRouter();
  const { items, unreadCount, loading, open, setOpen, markRead, markAllRead } = useNotificationInbox();
  const { userRole } = useAuth();

  const handleItemClick = (item: NotificationItem) => {
    if (!item.isRead) void markRead(item.id);

    const url = resolveNotificationUrl(item, userRole);
    if (url) {
      setOpen(false);
      router.push(url);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex size-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        aria-label="Thông báo"
        aria-expanded={open}
      >
        <Bell className="size-[18px]" strokeWidth={2} />
        {unreadCount > 0 ? (
          <span className="absolute right-1 top-1 flex min-h-[16px] min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-transparent"
            aria-label="Đóng thông báo"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">Thông báo</p>
              <button
                type="button"
                onClick={() => void markAllRead()}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <CheckCheck className="size-3.5" />
                Đọc tất cả
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {loading && items.length === 0 ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
                  <Loader2 className="size-4 animate-spin" />
                  Đang tải…
                </div>
              ) : items.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-slate-500">Chưa có thông báo.</p>
              ) : (
                items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      'group flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50',
                      !item.isRead && 'bg-primary/5',
                    )}
                  >
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 transition-colors group-hover:bg-slate-100">
                      <NotificationTypeIcon type={item.type} className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-slate-900">{item.title}</p>
                        {!item.isRead && (
                          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{item.content}</p>
                      <p className="mt-1 text-[10px] text-slate-400">{notificationRelativeTime(item.createdAt)}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
