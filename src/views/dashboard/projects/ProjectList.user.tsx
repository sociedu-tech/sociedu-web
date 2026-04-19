'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FolderOpen, Plus } from 'lucide-react';
import { MenteeIncomingOffers } from '@/views/dashboard/projects/MenteeIncomingOffers';

/** Học viên: dự án / gói đang tham gia (placeholder — nối API sau). */
export function ProjectListUser() {
  const searchParams = useSearchParams();
  const justCreated = searchParams.get('created') === '1';

  const rows = [
    { id: 'demo-1', name: 'Đồ án tốt nghiệp — Review', mentor: 'Nguyễn A', status: 'Đang làm' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px] leading-relaxed text-gray">
          Danh sách dự án / gói bạn đang tham gia cùng mentor.
        </p>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus className="size-4" strokeWidth={2.5} />
          Tạo dự án mới
        </Link>
      </div>

      {justCreated ? (
        <div
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          role="status"
        >
          Dự án đã được tạo. Bạn có thể mời mentor từ gợi ý hoặc tìm thêm trong mục Tìm Mentor.
        </div>
      ) : null}

      <MenteeIncomingOffers />

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-[10px] font-semibold uppercase tracking-[1px] text-gray">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="hidden px-4 py-3 sm:table-cell">Mentor</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 w-28" />
            </tr>
          </thead>
          <tbody className="text-dark">
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="hidden px-4 py-3 text-gray sm:table-cell">{row.mentor}</td>
                <td className="px-4 py-3">
                  <span className="badge-primary">{row.status}</span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/dashboard/projects/${row.id}`} className="text-primary font-semibold hover:underline">
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <div className="glass-card flex flex-col items-center gap-2 p-10 text-center text-gray">
          <FolderOpen className="size-10 text-gray-300" strokeWidth={1.5} />
          <p>Chưa có dự án nào.</p>
        </div>
      )}
    </div>
  );
}
