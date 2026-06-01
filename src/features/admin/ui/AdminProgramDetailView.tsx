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
            <dt className="text-xs font-medium text-slate-500">Học viên</dt>
            <dd className="mt-1 font-medium text-slate-900">{row.learnerName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Mentor</dt>
            <dd className="mt-1 font-medium text-slate-900">{row.mentorName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Ngày tạo</dt>
            <dd className="mt-1 text-slate-800">{row.createdAt}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Trạng thái vận hành</dt>
            <dd className="mt-1 text-slate-800">{adminBookingStatusLabel(row.status)}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">{ADMIN_PROGRAM.sessionList}</h2>
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
          {ADMIN_PROGRAM.sessionEmpty}
        </p>
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
