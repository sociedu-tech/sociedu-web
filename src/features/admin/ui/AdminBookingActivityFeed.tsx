'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardSurface } from '@/features/dashboard/ui/modules';
import { useAdminBookingActivity } from '@/features/admin/hooks/useAdminBookingActivity';
import {
  bookingStatusLabel,
  bookingStatusBadgeClass,
  bookingStatusDotClass,
} from '@/lib/bookingNotificationUi';
import { notificationRelativeTime } from '@/lib/notificationUi';
import { useNotificationNavigation } from '@/hooks/useNotificationNavigation';
import type { NotificationItem } from '@/services/notificationService';

function extractBookingStatus(item: NotificationItem): string {
  const meta = (item.metadata ?? {}) as Record<string, unknown>;
  return String(meta.bookingStatus ?? meta.status ?? '');
}

export function AdminBookingActivityFeedLink() {
  return (
    <Link
      href="/dashboard/bookings"
      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
    >
      Xem tất cả
      <ArrowRight className="size-3.5" />
    </Link>
  );
}

export function AdminBookingActivityFeed() {
  const { navigateFromNotification } = useNotificationNavigation();
  const { items, loading } = useAdminBookingActivity();

  const handleClick = (item: NotificationItem) => {
    void navigateFromNotification(item);
  };

  return (
    <DashboardSurface>
      <div className="px-5 py-3">
        {loading && items.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-dashboard-muted">
            <Loader2 className="size-4 animate-spin" />
            Đang tải…
          </div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center">
            <CalendarCheck className="mx-auto size-10 text-dashboard-border" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-dashboard-muted">Chưa có hoạt động booking mới.</p>
            <p className="mt-1 text-xs text-dashboard-subtle">
              Thông báo sẽ hiển thị khi mentor hoặc học viên thay đổi trạng thái booking.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div
              className="absolute bottom-3 left-[7px] top-3 w-px bg-dashboard-border-subtle"
              aria-hidden
            />

            <ul className="space-y-0.5">
              {items.map((item, idx) => {
                const status = extractBookingStatus(item);
                const meta = (item.metadata ?? {}) as Record<string, unknown>;
                const learner = meta.learnerName ? String(meta.learnerName) : null;
                const mentor = meta.mentorName ? String(meta.mentorName) : null;
                const pkg = meta.packageTitle ? String(meta.packageTitle) : null;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleClick(item)}
                      className={cn(
                        'group relative flex w-full items-start gap-3 rounded-xl px-0 py-3 text-left transition-colors hover:bg-dashboard-canvas',
                        idx === 0 && !item.isRead && 'animate-in slide-in-from-top-2 fade-in duration-300',
                      )}
                    >
                      <span
                        className={cn(
                          'relative z-10 mt-1.5 size-[15px] shrink-0 rounded-full ring-[3px] ring-dashboard-surface',
                          status ? bookingStatusDotClass(status) : 'bg-dashboard-subtle',
                        )}
                        aria-hidden
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm leading-snug text-dashboard-ink-secondary">
                            <span className="font-semibold text-dashboard-ink">{item.title}</span>
                          </p>
                          {status ? (
                            <span
                              className={cn(
                                'mt-0.5 inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset',
                                bookingStatusBadgeClass(status),
                              )}
                            >
                              {bookingStatusLabel(status)}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-dashboard-muted">{item.content}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-dashboard-subtle">
                          {learner && mentor ? (
                            <span>
                              {learner} ↔ {mentor}
                            </span>
                          ) : null}
                          {pkg ? <span className="truncate">Gói: {pkg}</span> : null}
                          <span>{notificationRelativeTime(item.createdAt)}</span>
                        </div>
                      </div>

                      {!item.isRead ? (
                        <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </DashboardSurface>
  );
}
