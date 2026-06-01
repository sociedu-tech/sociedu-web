'use client';

import type { BookingStatus } from '@/types';

/* -------------------------------------------------------------------------- */
/*  Label tiếng Việt                                                          */
/* -------------------------------------------------------------------------- */

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending_payment: 'Chờ thanh toán',
  confirmed: 'Đã xác nhận',
  in_progress: 'Đang diễn ra',
  completed: 'Hoàn thành',
  cancelled_by_user: 'User đã hủy',
  cancelled_by_mentor: 'Mentor đã hủy',
  no_show: 'Vắng mặt',
};

export function bookingStatusLabel(status: BookingStatus | string): string {
  return STATUS_LABEL[status as BookingStatus] ?? String(status);
}

/* -------------------------------------------------------------------------- */
/*  Badge class (Tailwind)                                                    */
/* -------------------------------------------------------------------------- */

const STATUS_BADGE: Record<BookingStatus, string> = {
  pending_payment: 'bg-amber-50 text-amber-700 ring-amber-600/15',
  confirmed: 'bg-sky-50 text-sky-700 ring-sky-600/15',
  in_progress: 'bg-indigo-50 text-indigo-700 ring-indigo-600/15',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  cancelled_by_user: 'bg-rose-50 text-rose-700 ring-rose-600/15',
  cancelled_by_mentor: 'bg-rose-50 text-rose-700 ring-rose-600/15',
  no_show: 'bg-slate-800 text-white ring-slate-700',
};

export function bookingStatusBadgeClass(status: BookingStatus | string): string {
  return STATUS_BADGE[status as BookingStatus] ?? 'bg-slate-100 text-slate-700 ring-slate-200';
}

/* -------------------------------------------------------------------------- */
/*  Dot color cho timeline                                                    */
/* -------------------------------------------------------------------------- */

const STATUS_DOT: Record<BookingStatus, string> = {
  pending_payment: 'bg-amber-500',
  confirmed: 'bg-sky-500',
  in_progress: 'bg-indigo-500',
  completed: 'bg-emerald-500',
  cancelled_by_user: 'bg-rose-500',
  cancelled_by_mentor: 'bg-rose-500',
  no_show: 'bg-slate-700',
};

export function bookingStatusDotClass(status: BookingStatus | string): string {
  return STATUS_DOT[status as BookingStatus] ?? 'bg-slate-400';
}

/* -------------------------------------------------------------------------- */
/*  Action verb — mô tả hành động ngắn gọn                                   */
/* -------------------------------------------------------------------------- */

const ACTION_VERB: Record<BookingStatus, string> = {
  pending_payment: 'đã đặt lịch',
  confirmed: 'đã xác nhận booking',
  in_progress: 'bắt đầu buổi học',
  completed: 'đã hoàn thành booking',
  cancelled_by_user: 'đã hủy booking',
  cancelled_by_mentor: 'đã hủy booking',
  no_show: 'vắng mặt buổi học',
};

export function bookingActionVerb(status: BookingStatus | string): string {
  return ACTION_VERB[status as BookingStatus] ?? 'cập nhật booking';
}

/* -------------------------------------------------------------------------- */
/*  Summary 1-dòng từ notification metadata                                   */
/* -------------------------------------------------------------------------- */

export function bookingNotificationSummary(
  meta: Record<string, unknown> | null | undefined,
): string {
  if (!meta) return '';

  const status = String(meta.bookingStatus ?? meta.status ?? '');
  const learner = meta.learnerName ? String(meta.learnerName) : null;
  const mentor = meta.mentorName ? String(meta.mentorName) : null;
  const pkg = meta.packageTitle ? String(meta.packageTitle) : null;

  const verb = bookingActionVerb(status);
  const actor = learner ?? mentor ?? 'Người dùng';

  const parts = [actor, verb];
  if (learner && mentor) {
    parts.push(`với ${status.startsWith('cancelled_by_mentor') ? 'học viên' : 'mentor'} ${status.startsWith('cancelled_by_mentor') ? learner : mentor}`);
  }
  if (pkg) {
    parts.push(`· Gói: ${pkg}`);
  }
  return parts.join(' ');
}
