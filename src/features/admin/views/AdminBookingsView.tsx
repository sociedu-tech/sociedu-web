'use client';

import React from 'react';
import { CalendarClock } from 'lucide-react';
import type { AdminBookingRow, BookingStatus } from '@/types';
import { cn } from '@/lib/utils';
import { useAdminBookingsView } from '@/features/admin/hooks';

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: 'pending_payment', label: 'Chờ thanh toán' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'in_progress', label: 'Đang diễn ra' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled_by_user', label: 'Hủy (user)' },
  { value: 'cancelled_by_mentor', label: 'Hủy (mentor)' },
  { value: 'no_show', label: 'Vắng mặt' },
];

function statusBadgeClass(s: BookingStatus) {
  switch (s) {
    case 'completed':
      return 'bg-emerald-50 text-emerald-900 ring-emerald-100';
    case 'in_progress':
      return 'bg-sky-50 text-sky-900 ring-sky-100';
    case 'confirmed':
      return 'bg-indigo-50 text-indigo-900 ring-indigo-100';
    case 'pending_payment':
      return 'bg-amber-50 text-amber-900 ring-amber-100';
    case 'cancelled_by_user':
    case 'cancelled_by_mentor':
      return 'bg-slate-100 text-slate-700 ring-slate-200';
    case 'no_show':
      return 'bg-rose-50 text-rose-900 ring-rose-100';
    default:
      return 'bg-slate-50 text-slate-700 ring-slate-100';
  }
}

function statusLabel(s: BookingStatus) {
  return STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s;
}

export function AdminBookingsView({ initialRows }: { initialRows: AdminBookingRow[] }) {
  const { statusFilter, setStatusFilter, filtered, updateStatus } = useAdminBookingsView(initialRows);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 sm:w-auto"
        >
          <option value="all">Mọi trạng thái booking</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500">
          Đổi trạng thái để mô phỏng quy trình vận hành; API thật sẽ ghi log và thông báo.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="min-w-[960px] w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Học viên → Mentor</th>
              <th className="px-4 py-3">Lịch</th>
              <th className="px-4 py-3">Gói</th>
              <th className="px-4 py-3">Số tiền</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-800">{r.code}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{r.learnerName}</p>
                  <p className="text-xs text-slate-500">→ {r.mentorName}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-start gap-2 text-slate-700">
                    <CalendarClock className="mt-0.5 size-4 shrink-0 text-slate-400" />
                    <div>
                      <p>{r.scheduledAt}</p>
                      <p className="text-xs text-slate-500">{r.durationMin} phút</p>
                    </div>
                  </div>
                </td>
                <td className="max-w-[200px] px-4 py-3 text-slate-700">
                  <span className="line-clamp-2">{r.packageTitle}</span>
                </td>
                <td className="px-4 py-3 tabular-nums text-slate-900">{r.amountVnd.toLocaleString('vi-VN')}đ</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <span className={cn('inline-flex w-fit rounded-full px-2 py-0.5 text-[11px] font-medium ring-1', statusBadgeClass(r.status))}>
                      {statusLabel(r.status)}
                    </span>
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value as BookingStatus)}
                      className="max-w-[200px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-300"
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
