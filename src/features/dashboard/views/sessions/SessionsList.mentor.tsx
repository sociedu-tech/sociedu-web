'use client';

import { Video } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DashboardTableCard, dashboardTableHeadClass } from '@/features/dashboard/ui/DashboardTable';
import { useDashboardBookings } from '@/features/dashboard/hooks/useDashboardBookings';
import { DataPagination } from '@/components/ui/DataPagination';

export function SessionsListMentor() {
  const { rows, loading, error, refresh, page, size, total, totalPages, setPage, setSize } =
    useDashboardBookings('mentor');

  if (loading) {
    return <LoadingSpinner label="Đang tải buổi học…" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="space-y-4">
      <DashboardTableCard>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className={dashboardTableHeadClass}>
              <th className="px-4 py-3">Buổi học</th>
              <th className="hidden px-4 py-3 sm:table-cell">Thời gian</th>
              <th className="hidden px-4 py-3 md:table-cell">Học viên</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {rows.map((row) => (
              <tr key={row.id} className="bg-white hover:bg-slate-50/80">
                <td className="px-4 py-3 font-medium">{row.title}</td>
                <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">{row.when}</td>
                <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{row.counterparty}</td>
                <td className="px-4 py-3">
                  <span className="badge-primary">{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardTableCard>
      {rows.length === 0 && !loading && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-slate-500 shadow-sm">
          <Video className="size-10 text-slate-300" strokeWidth={1.5} />
          <p>Chưa có buổi học nào.</p>
        </div>
      )}
      <DataPagination
        page={page}
        size={size}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onSizeChange={setSize}
        disabled={loading}
      />
    </div>
  );
}
