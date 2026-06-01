'use client';

import { BookOpen } from 'lucide-react';
import { useAdminBookingsView } from '@/features/admin/hooks/useAdminBookingsView';
import { AdminProgramCard } from '@/features/admin/ui/AdminProgramCard';
import { ADMIN_PROGRAM } from '@/features/dashboard/lib/programLabels';
import { ADMIN_BOOKING_STATUS_OPTIONS } from '@/features/admin/lib/adminBookingLabels';
import { adminSelect } from '@/features/admin/ui/adminClasses';
import { DataPagination } from '@/components/ui/DataPagination';

export function AdminProgramList() {
  const {
    statusFilter,
    setStatusFilter,
    filtered,
    loading,
    page,
    size,
    total,
    totalPages,
    setPage,
    setSize,
  } = useAdminBookingsView();

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`w-full max-w-xs sm:w-auto ${adminSelect}`}
        >
          <option value="all">Tất cả trạng thái</option>
          {ADMIN_BOOKING_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500">
          Lọc và theo dõi lộ trình mentoring trên toàn hệ thống.
        </p>
      </div>

      {loading && filtered.length === 0 ? (
        <p className="text-center text-sm text-slate-500">Đang tải lộ trình mentoring…</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-slate-500 shadow-sm">
          <BookOpen className="size-10 text-slate-300" strokeWidth={1.5} />
          <p className="font-medium text-slate-700">{ADMIN_PROGRAM.emptyTitle}</p>
          <p className="text-sm text-slate-500">{ADMIN_PROGRAM.emptyHint}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((row) => (
            <AdminProgramCard key={row.id} row={row} />
          ))}
        </div>
      )}

      {!loading ? (
        <DataPagination
          page={page}
          size={size}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onSizeChange={setSize}
        />
      ) : null}
    </div>
  );
}
