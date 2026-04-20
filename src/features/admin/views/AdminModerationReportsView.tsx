'use client';

import React from 'react';
import { Flag } from 'lucide-react';
import type { AdminModerationReport, ModerationReportStatus, ModerationTargetType } from '@/types';
import { cn } from '@/lib/utils';
import { useAdminModerationReportsView } from '@/features/admin/hooks';

const TARGET_LABEL: Record<ModerationTargetType, string> = {
  user: 'Người dùng',
  mentor: 'Mentor',
  booking: 'Booking',
  session: 'Buổi học',
  review: 'Đánh giá',
};

const REPORT_STATUS: { value: ModerationReportStatus; label: string }[] = [
  { value: 'open', label: 'Mới' },
  { value: 'in_review', label: 'Đang xử lý' },
  { value: 'resolved', label: 'Đã xử lý' },
  { value: 'dismissed', label: 'Đã bỏ qua' },
];

function priorityClass(p: AdminModerationReport['priority']) {
  switch (p) {
    case 'high':
      return 'bg-rose-50 text-rose-800 ring-rose-100';
    case 'normal':
      return 'bg-slate-50 text-slate-700 ring-slate-200';
    case 'low':
      return 'bg-slate-50/80 text-slate-500 ring-slate-100';
  }
}

export function AdminModerationReportsView({ initialReports }: { initialReports: AdminModerationReport[] }) {
  const { typeFilter, setTypeFilter, filtered, setStatus } = useAdminModerationReportsView(initialReports);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 sm:w-auto"
        >
          <option value="all">Mọi loại đối tượng</option>
          {(Object.keys(TARGET_LABEL) as ModerationTargetType[]).map((k) => (
            <option key={k} value={k}>
              {TARGET_LABEL[k]}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500">
          Tổng hợp báo cáo từ người dùng và cảnh báo hệ thống. Gán trạng thái để theo dõi SLA xử lý.
        </p>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 py-16 text-center">
            <Flag className="size-10 text-slate-300" />
            <p className="text-sm text-slate-500">Không có báo cáo phù hợp bộ lọc.</p>
          </div>
        ) : (
          filtered.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
                      {r.id}
                    </span>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-800 ring-1 ring-indigo-100">
                      {TARGET_LABEL[r.targetType]}
                    </span>
                    <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium ring-1', priorityClass(r.priority))}>
                      {r.priority === 'high' ? 'Ưu tiên cao' : r.priority === 'normal' ? 'Bình thường' : 'Thấp'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{r.category}</p>
                  <p className="text-sm leading-relaxed text-slate-600">{r.summary}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>
                      Đối tượng: <strong className="text-slate-700">{r.targetLabel}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Người gửi: {r.reporterName} ({r.createdAt})
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                  <select
                    value={r.status}
                    onChange={(e) => setStatus(r.id, e.target.value as ModerationReportStatus)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    {REPORT_STATUS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
