'use client';

import { FolderOpen } from 'lucide-react';
import { DashboardTableCard, dashboardTableHeadClass } from '@/features/dashboard/ui/DashboardTable';

export function ProjectListAdmin() {
  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        API liệt kê báo cáo tiến độ toàn hệ thống cho admin chưa có. Hiện chỉ mentor/học viên xem được báo cáo của mình.
      </p>
      <DashboardTableCard>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className={dashboardTableHeadClass}>
              <th className="px-4 py-3">Tên</th>
              <th className="hidden px-4 py-3 sm:table-cell">Cặp</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800" />
        </table>
      </DashboardTableCard>
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-slate-500 shadow-sm">
        <FolderOpen className="size-10 text-slate-300" strokeWidth={1.5} />
        <p>Chưa có dữ liệu từ API admin.</p>
      </div>
    </div>
  );
}
