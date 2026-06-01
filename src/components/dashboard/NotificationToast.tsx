'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  MessageSquare,
  ShoppingBag,
  CalendarCheck,
  UserCheck,
  Flag,
  Star,
  X,
} from 'lucide-react';
import type { NotificationItem } from '@/services/notificationService';
import { resolveNotificationUrl } from '@/lib/notificationRouter';
import { useAuth } from '@/context/AuthContext';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ToastEntry {
  id: string;
  item: NotificationItem;
  /** Controls exit animation */
  exiting: boolean;
}

/* ------------------------------------------------------------------ */
/*  Icon resolver                                                      */
/* ------------------------------------------------------------------ */

function notificationIcon(type: string) {
  switch (type) {
    case 'CHAT':
      return <MessageSquare className="size-5 text-indigo-500" />;
    case 'ORDER':
      return <ShoppingBag className="size-5 text-emerald-500" />;
    case 'BOOKING':
      return <CalendarCheck className="size-5 text-sky-500" />;
    case 'MENTOR_APPLICATION':
      return <UserCheck className="size-5 text-amber-500" />;
    case 'MODERATION':
      return <Flag className="size-5 text-rose-500" />;
    case 'REVIEW':
      return <Star className="size-5 text-amber-500" />;
    default:
      return <Bell className="size-5 text-slate-500" />;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const TOAST_DURATION_MS = 5000;
const EXIT_ANIMATION_MS = 400;
const MAX_TOASTS = 4;

export function NotificationToastContainer() {
  const router = useRouter();
  const { userRole } = useAuth();
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  /* ---------- dismiss a toast ---------- */
  const dismiss = useCallback((id: string) => {
    // Clear auto-dismiss timer
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    // Start exit animation
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));

    // Remove after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_ANIMATION_MS);
  }, []);

  /* ---------- push a new toast ---------- */
  const push = useCallback(
    (item: NotificationItem) => {
      const id = item.id || `nt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      setToasts((prev) => {
        // Avoid duplicate
        if (prev.some((t) => t.id === id)) return prev;
        const next = [{ id, item, exiting: false }, ...prev];
        // Trim to max
        return next.slice(0, MAX_TOASTS);
      });

      // Schedule auto-dismiss
      const timer = setTimeout(() => dismiss(id), TOAST_DURATION_MS);
      timersRef.current.set(id, timer);
    },
    [dismiss],
  );

  /* ---------- expose push via window event ---------- */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<NotificationItem>).detail;
      if (detail) push(detail);
    };
    window.addEventListener('notification:toast', handler);
    return () => window.removeEventListener('notification:toast', handler);
  }, [push]);

  /* ---------- click handler ---------- */
  const handleClick = useCallback(
    (entry: ToastEntry) => {
      const url = resolveNotificationUrl(entry.item, userRole);
      dismiss(entry.id);
      if (url) {
        router.push(url);
      }
    },
    [dismiss, router],
  );

  /* ---------- cleanup timers on unmount ---------- */
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(100vw-2rem,24rem)] flex-col gap-3">
      {toasts.map((entry) => (
        <div
          key={entry.id}
          className={`
            pointer-events-auto flex cursor-pointer items-start gap-3
            rounded-2xl border border-white/30 bg-white/80 p-4
            shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl
            transition-all duration-300
            hover:bg-white hover:shadow-[0_8px_40px_rgba(0,0,0,0.18)]
            ${entry.exiting
              ? 'translate-x-[120%] opacity-0'
              : 'translate-x-0 opacity-100 animate-in slide-in-from-right-12 fade-in duration-300'
            }
          `}
          onClick={() => handleClick(entry)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleClick(entry);
          }}
        >
          {/* Icon */}
          <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100">
            {notificationIcon(entry.item.type)}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {entry.item.title}
            </p>
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
              {entry.item.content}
            </p>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              dismiss(entry.id);
            }}
            className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Đóng"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper to fire toast from anywhere                                 */
/* ------------------------------------------------------------------ */

export function fireNotificationToast(item: NotificationItem) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('notification:toast', { detail: item }));
}
