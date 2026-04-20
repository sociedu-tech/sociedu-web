'use client';

import { Video } from 'lucide-react';
import { DashboardTableCard, dashboardTableHeadClass } from '@/features/dashboard/ui/DashboardTable';

/** Học viên: buổi học đã đặt / sắp tới (placeholder). */
export function SessionsListUser() {
  const rows = [
    { id: 's1', title: 'Review đồ án — tuần 3', when: '20/04/2026 19:00', mentor: 'Nguyễn A', status: 'Sắp diễn ra' },
  ];

  return (
    <div className="space-y-4">
      <DashboardTableCard>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className={dashboardTableHeadClass}>
              <th className="px-4 py-3">Buổi học</th>
              <th className="hidden px-4 py-3 sm:table-cell">Thời gian</th>
              <th className="hidden px-4 py-3 md:table-cell">Mentor</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {rows.map((row) => (
              <tr key={row.id} className="bg-white hover:bg-slate-50/80">
                <td className="px-4 py-3 font-medium">{row.title}</td>
                <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">{row.when}</td>
                <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{row.mentor}</td>
                <td className="px-4 py-3">
                  <span className="badge-primary">{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardTableCard>
      {rows.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-slate-500 shadow-sm">
          <Video className="size-10 text-slate-300" strokeWidth={1.5} />
          <p>Chưa có buổi học nào.</p>
        </div>
      )}
    </div>
  );
}
