'use client';

import { Video } from 'lucide-react';

/** Học viên: buổi học đã đặt / sắp tới (placeholder). */
export function SessionsListUser() {
  const rows = [
    { id: 's1', title: 'Review đồ án — tuần 3', when: '20/04/2026 19:00', mentor: 'Nguyễn A', status: 'Sắp diễn ra' },
  ];

  return (
    <div className="space-y-6">
      <p className="text-[15px] leading-relaxed text-gray">
        Lịch buổi học 1–1 với mentor.
      </p>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-[10px] font-semibold uppercase tracking-[1px] text-gray">
            <tr>
              <th className="px-4 py-3">Buổi học</th>
              <th className="hidden px-4 py-3 sm:table-cell">Thời gian</th>
              <th className="hidden px-4 py-3 md:table-cell">Mentor</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-dark">
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{row.title}</td>
                <td className="hidden px-4 py-3 text-gray sm:table-cell">{row.when}</td>
                <td className="hidden px-4 py-3 text-gray md:table-cell">{row.mentor}</td>
                <td className="px-4 py-3">
                  <span className="badge-primary">{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <div className="glass-card flex flex-col items-center gap-2 p-10 text-center text-gray">
          <Video className="size-10 text-gray-300" strokeWidth={1.5} />
          <p>Chưa có buổi học nào.</p>
        </div>
      )}
    </div>
  );
}
