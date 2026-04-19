'use client';

import Link from 'next/link';
import { FolderOpen } from 'lucide-react';
import { DashboardTableCard, dashboardTableHeadClass } from '@/components/dashboard/DashboardTable';

/** Admin: toàn bộ dự án trên hệ thống (placeholder). */
export function ProjectListAdmin() {
  const rows = [
    { id: 'demo-1', name: 'Đồ án tốt nghiệp — Review', owner: 'Trần B', mentor: 'Nguyễn A', status: 'Đang làm' },
  ];

  return (
    <div className="space-y-4">
      <DashboardTableCard>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className={dashboardTableHeadClass}>
              <th className="px-4 py-3">Tên</th>
              <th className="hidden px-4 py-3 md:table-cell">Học viên</th>
              <th className="hidden px-4 py-3 lg:table-cell">Mentor</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="w-28 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {rows.map((row) => (
              <tr key={row.id} className="bg-white hover:bg-slate-50/80">
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{row.owner}</td>
                <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">{row.mentor}</td>
                <td className="px-4 py-3">
                  <span className="badge-primary">{row.status}</span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/dashboard/projects/${row.id}`} className="font-semibold text-primary hover:underline">
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardTableCard>
      {rows.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-slate-500 shadow-sm">
          <FolderOpen className="size-10 text-slate-300" strokeWidth={1.5} />
          <p>Chưa có dữ liệu.</p>
        </div>
      )}
    </div>
  );
}
