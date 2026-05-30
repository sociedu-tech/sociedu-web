'use client';

import { Video } from 'lucide-react';
import { DashboardTableCard, dashboardTableHeadClass } from '@/features/dashboard/ui/DashboardTable';

/** Admin: API liệt kê booking toàn hệ thống chưa có — hiển thị trạng thái trống. */
export function SessionsListAdmin() {
  const rows: never[] = [];

  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        API quản trị danh sách booking toàn hệ thống chưa có trên backend. Vui lòng dùng trang Quản lý đặt lịch khi endpoint sẵn sàng.
      </p>
      <DashboardTableCard>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className={dashboardTableHeadClass}>
              <th className="px-4 py-3">Buổi học</th>
              <th className="hidden px-4 py-3 sm:table-cell">Thời gian</th>
              <th className="hidden px-4 py-3 md:table-cell">Cặp học</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800" />
        </table>
      </DashboardTableCard>
      {rows.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-slate-500 shadow-sm">
          <Video className="size-10 text-slate-300" strokeWidth={1.5} />
          <p>Chưa có dữ liệu buổi học từ API admin.</p>
        </div>
      )}
    </div>
  );
}
