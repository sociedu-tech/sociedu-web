'use client';

import { BookOpen } from 'lucide-react';
import { useAdminBookingsView } from '@/features/admin/hooks/useAdminBookingsView';
import { AdminProgramCard } from '@/features/admin/ui/AdminProgramCard';
import { ADMIN_PROGRAM } from '@/features/dashboard/lib/programLabels';
import { ADMIN_BOOKING_STATUS_OPTIONS } from '@/features/admin/lib/adminBookingLabels';
import { adminSelect } from '@/features/admin/ui/adminClasses';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { DataPagination } from '@/components/ui/DataPagination';

export function AdminProgramList() {
  const {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    filtered,
    loading,
    page,
    size,
    total,
    totalPages,
    setPage,
    setSize,
  } = useAdminBookingsView();

  if (loading && filtered.length === 0) {
    return <PageLoadingState label="Đang tải lộ trình mentoring…" variant="cards" cardCount={3} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-1 max-w-md w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên học viên, mentor..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full sm:w-auto shrink-0 ${adminSelect}`}
          >
            <option value="all">Tất cả trạng thái</option>
            {ADMIN_BOOKING_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-slate-500">
          Lọc và theo dõi lộ trình mentoring trên toàn hệ thống.
        </p>
      </div>

      {filtered.length === 0 ? (
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
