'use client';

const DEFAULT_ROWS = [
  { id: 's1', title: 'Review đồ án — tuần 3', when: '20/04/2026 19:00', pair: 'Trần B ↔ Nguyễn A', status: 'Sắp diễn ra' },
  { id: 's2', title: 'Chấm báo cáo giữa kỳ', when: '21/04/2026 14:00', pair: 'Lê M ↔ Phạm K', status: 'Sắp diễn ra' },
  { id: 's3', title: 'Workshop Git & CI/CD', when: '18/04/2026 20:00', pair: 'Cố vấn — 12 học viên', status: 'Đã xong' },
  { id: 's4', title: '1-1: định hướng luận văn', when: '17/04/2026 09:30', pair: 'Ngọc H ↔ Đức T', status: 'Đã xong' },
  { id: 's5', title: 'Mock phỏng vấn internship', when: '22/04/2026 16:00', pair: 'An N ↔ Minh P', status: 'Đã hủy' },
] as const;

/** Admin: giám sát buổi học toàn hệ thống (dữ liệu mẫu — API sau). */
export function SessionsListAdmin() {
  const rows = DEFAULT_ROWS;

  return (
    <div className="space-y-6">
      <p className="text-[15px] leading-relaxed text-gray">
        Tổng quan buổi học trên nền tảng (dữ liệu mẫu để xem giao diện; tích hợp API sau).
      </p>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-[10px] font-semibold uppercase tracking-[1px] text-gray">
            <tr>
              <th className="px-4 py-3">Buổi học</th>
              <th className="hidden px-4 py-3 sm:table-cell">Thời gian</th>
              <th className="hidden px-4 py-3 lg:table-cell">Cặp</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-dark">
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{row.title}</td>
                <td className="hidden px-4 py-3 text-gray sm:table-cell">{row.when}</td>
                <td className="hidden px-4 py-3 text-gray lg:table-cell">{row.pair}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      row.status === 'Đã xong'
                        ? 'badge-primary'
                        : row.status === 'Đã hủy'
                          ? 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600'
                          : 'badge-primary'
                    }
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
