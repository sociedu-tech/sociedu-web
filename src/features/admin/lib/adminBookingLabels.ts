import type { AdminBookingRow, BookingStatus } from '@/types';

export const ADMIN_BOOKING_STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: 'pending_payment', label: 'Chờ thanh toán' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'in_progress', label: 'Đang diễn ra' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled_by_user', label: 'Hủy (học viên)' },
  { value: 'cancelled_by_mentor', label: 'Hủy (mentor)' },
  { value: 'no_show', label: 'Vắng mặt' },
];

export function adminBookingStatusLabel(status: BookingStatus): string {
  return ADMIN_BOOKING_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

export function adminBookingProgressPercent(status: BookingStatus): number {
  switch (status) {
    case 'completed':
      return 100;
    case 'in_progress':
      return 55;
    case 'confirmed':
      return 15;
    case 'pending_payment':
      return 5;
    default:
      return 0;
  }
}

export function adminBookingStatusBadgeClass(status: BookingStatus): string {
  switch (status) {
    case 'completed':
      return 'bg-primary/10 text-primary ring-primary/25';
    case 'in_progress':
      return 'bg-slate-900 text-white ring-slate-800';
    case 'confirmed':
      return 'bg-slate-200 text-slate-900 ring-slate-300';
    case 'pending_payment':
      return 'bg-slate-100 text-slate-800 ring-slate-200';
    case 'cancelled_by_user':
    case 'cancelled_by_mentor':
      return 'bg-slate-50 text-slate-600 ring-slate-200';
    case 'no_show':
      return 'bg-slate-800 text-white ring-slate-700';
    default:
      return 'bg-slate-50 text-slate-700 ring-slate-200';
  }
}

export function formatAdminPairLabel(row: AdminBookingRow): string {
  return `${row.learnerName} · ${row.mentorName}`;
}
