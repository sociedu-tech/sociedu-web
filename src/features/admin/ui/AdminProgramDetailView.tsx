'use client';

import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminBookingRow, BookingStatus } from '@/types';
import { ADMIN_PROGRAM } from '@/features/dashboard/lib/programLabels';
import {
  ADMIN_BOOKING_STATUS_OPTIONS,
  adminBookingProgressPercent,
  adminBookingStatusBadgeClass,
  adminBookingStatusLabel,
  formatAdminPairLabel,
} from '@/features/admin/lib/adminBookingLabels';
import { adminSelect } from '@/features/admin/ui/adminClasses';

type Props = {
  row: AdminBookingRow;
  onStatusChange: (id: string, status: BookingStatus) => void;
};

function formatViDateTime(isoString?: string | null) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return String(isoString);
  return d.toLocaleString('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function sessionStatusLabel(status?: string | null) {
  const s = String(status ?? '').toLowerCase();
  switch (s) {
    case 'upcoming':
    case 'scheduled':
      return 'Sắp diễn ra';
    case 'in_progress':
      return 'Đang diễn ra';
    case 'completed':
    case 'done':
      return 'Hoàn thành';
    case 'cancelled':
    case 'canceled':
      return 'Đã hủy';
    default:
      return status || 'Chưa diễn ra';
  }
}

export function AdminProgramDetailView({ row, onStatusChange }: Props) {
  const progress = adminBookingProgressPercent(row.status);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 border-b border-slate-200/90 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{row.packageTitle}</h1>
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="size-4 text-slate-400" />
            {formatAdminPairLabel(row)}
          </p>
          <span
            className={cn(
              'inline-flex rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
              adminBookingStatusBadgeClass(row.status),
            )}
          >
            {adminBookingStatusLabel(row.status)}
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-xs font-medium text-slate-500">Cập nhật trạng thái</label>
          <select
            value={row.status}
            onChange={(e) => onStatusChange(row.id, e.target.value as BookingStatus)}
            className={`min-w-[200px] ${adminSelect}`}
          >
            {ADMIN_BOOKING_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={ADMIN_PROGRAM.progress} value={`${progress}%`} accent />
        <StatCard label="Mã booking" value={row.code} compact />
        <StatCard label="Thời lượng" value={`${row.durationMin} phút`} compact />
        <StatCard
          label="Giá trị gói"
          value={`${row.amountVnd.toLocaleString('vi-VN')}đ`}
          compact
        />
      </div>

      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">{ADMIN_PROGRAM.orderSection}</h2>
        <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-slate-505">Học viên</dt>
            <dd className="mt-1 font-medium text-slate-900">{row.learnerName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-505">Mentor</dt>
            <dd className="mt-1 font-medium text-slate-900">{row.mentorName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-505">Ngày tạo</dt>
            <dd className="mt-1 text-slate-800">{row.createdAt}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-505">Trạng thái vận hành</dt>
            <dd className="mt-1 text-slate-800">{adminBookingStatusLabel(row.status)}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">{ADMIN_PROGRAM.sessionList}</h2>
        {!row.sessions || row.sessions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            {ADMIN_PROGRAM.sessionEmpty}
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/90 text-[10px] font-semibold tracking-wider text-slate-500">
                    <th className="px-4 py-3">Buổi học</th>
                    <th className="px-4 py-3">Bắt đầu</th>
                    <th className="px-4 py-3">Kết thúc</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Phòng học</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {row.sessions.map((s, idx) => (
                    <tr key={s.id || idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {s.title || `Buổi ${idx + 1}`}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatViDateTime(s.scheduledAt)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatViDateTime((s as any).scheduledAtEnd)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1',
                            String(s.status).toLowerCase() === 'completed' || String(s.status).toLowerCase() === 'done'
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
                              : String(s.status).toLowerCase() === 'in_progress'
                              ? 'bg-amber-50 text-amber-700 ring-amber-600/10'
                              : 'bg-slate-100 text-slate-700 ring-slate-600/10',
                          )}
                        >
                          {sessionStatusLabel(s.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {s.meetingUrl ? (
                          <a
                            href={s.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-100"
                          >
                            Vào phòng
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">Chưa có link</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  compact,
}: {
  label: string;
  value: string;
  accent?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p
        className={cn(
          'mt-1 font-semibold leading-snug text-slate-900',
          accent ? 'text-lg text-indigo-600' : compact ? 'text-base' : 'text-lg',
        )}
      >
        {value}
      </p>
    </div>
  );
}
