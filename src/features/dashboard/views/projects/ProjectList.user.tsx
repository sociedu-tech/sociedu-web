'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FolderOpen } from 'lucide-react';
import { MenteeIncomingOffers } from '@/features/dashboard/views/projects/MenteeIncomingOffers';
import { DashboardTableCard, dashboardTableHeadClass } from '@/components/dashboard/DashboardTable';

/** Học viên: dự án / gói đang tham gia (placeholder — nối API sau). */
export function ProjectListUser() {
  const searchParams = useSearchParams();
  const justCreated = searchParams.get('created') === '1';

  const rows = [
    { id: 'demo-1', name: 'Đồ án tốt nghiệp — Review', mentor: 'Nguyễn A', status: 'Đang làm' },
  ];

  return (
    <div className="space-y-6">
      {justCreated ? (
        <div
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          role="status"
        >
          Dự án đã được tạo. Bạn có thể mời mentor từ gợi ý hoặc tìm thêm trong mục Tìm Mentor.
        </div>
      ) : null}

      <MenteeIncomingOffers />

      <DashboardTableCard>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className={dashboardTableHeadClass}>
              <th className="px-4 py-3">Tên</th>
              <th className="hidden px-4 py-3 sm:table-cell">Mentor</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="w-28 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {rows.map((row) => (
              <tr key={row.id} className="bg-white hover:bg-slate-50/80">
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">{row.mentor}</td>
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
          <p>Chưa có dự án nào.</p>
        </div>
      )}
    </div>
  );
}
