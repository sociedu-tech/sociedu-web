'use client';

import {
  Bell,
  CalendarCheck,
  FileText,
  Flag,
  MessageSquare,
  ShoppingBag,
  Star,
  UserCheck,
} from 'lucide-react';
import { formatDisplayDate } from '@/lib/formatDisplayDate';
import { cn } from '@/lib/utils';

export function NotificationTypeIcon({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const iconClass = cn('shrink-0', className);

  switch (type?.toUpperCase()) {
    case 'CHAT':
      return <MessageSquare className={cn(iconClass, 'text-indigo-500')} />;
    case 'ORDER':
      return <ShoppingBag className={cn(iconClass, 'text-emerald-500')} />;
    case 'BOOKING':
      return <CalendarCheck className={cn(iconClass, 'text-sky-500')} />;
    case 'MENTOR_APPLICATION':
      return <UserCheck className={cn(iconClass, 'text-amber-500')} />;
    case 'MODERATION':
      return <Flag className={cn(iconClass, 'text-rose-500')} />;
    case 'REVIEW':
      return <Star className={cn(iconClass, 'text-amber-500')} />;
    case 'REPORT_REQUEST':
      return <FileText className={cn(iconClass, 'text-violet-500')} />;
    default:
      return <Bell className={cn(iconClass, 'text-slate-400')} />;
  }
}

export function notificationRelativeTime(dateStr: string | undefined): string {
  if (!dateStr) return '';
  return formatDisplayDate(dateStr, { empty: '' });
}
