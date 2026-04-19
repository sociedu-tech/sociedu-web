'use client';

import Link from 'next/link';
import { FolderOpen } from 'lucide-react';

/** Mentor: dự án / học viên đang hỗ trợ (placeholder). */
export function ProjectListMentor() {
  const rows = [
    { id: 'demo-1', name: 'Đồ án tốt nghiệp — Review', mentee: 'Trần B', status: 'Đang làm' },
  ];

  return (
    <div className="space-y-6">
      <p className="text-[15px] leading-relaxed text-gray">
        Các dự án bạn đang đồng hành với học viên.
      </p>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-[10px] font-semibold uppercase tracking-[1px] text-gray">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="hidden px-4 py-3 sm:table-cell">Học viên</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 w-28" />
            </tr>
          </thead>
          <tbody className="text-dark">
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="hidden px-4 py-3 text-gray sm:table-cell">{row.mentee}</td>
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
