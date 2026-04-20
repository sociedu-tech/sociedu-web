'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Flag, UserCircle, Users } from 'lucide-react';
import type { AdminModerationReport, ModerationReportStatus, ModerationTargetType } from '@/types';
import { cn } from '@/lib/utils';
import { useAdminModerationReportsView, type AdminReportSegment } from '@/features/admin/hooks';
import { adminSelect } from '@/features/admin/ui/adminClasses';
import { listSlugForReport, moderationDetailPath } from '@/lib/moderationDetailRoutes';

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
      return 'bg-slate-900 text-white ring-slate-800';
    case 'normal':
      return 'bg-slate-100 text-slate-800 ring-slate-200';
    case 'low':
      return 'bg-slate-50 text-slate-600 ring-slate-200';
  }
}

type Props = {
  initialReports: AdminModerationReport[];
  segment: AdminReportSegment;
};

export function AdminModerationReportsView({ initialReports, segment }: Props) {
  const { filtered, setStatus } = useAdminModerationReportsView(initialReports, segment);

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-500">
        Chi tiết mở URL dạng <span className="font-mono text-slate-700">/dashboard/moderation/sessions/[id]</span> (hoặc{' '}
        <span className="font-mono">people</span>, <span className="font-mono">reviews</span>, <span className="font-mono">all</span>
        ). Sidebar nhóm «Báo cáo &amp; tranh chấp» có thanh cuộn khi nhiều mục.
      </p>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 py-16 text-center">
            <Flag className="size-10 text-slate-300" />
            <p className="text-sm text-slate-500">Không có báo cáo trong mục này.</p>
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
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/25">
                      {TARGET_LABEL[r.targetType]}
                    </span>
                    <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium ring-1', priorityClass(r.priority))}>
                      {r.priority === 'high' ? 'Ưu tiên cao' : r.priority === 'normal' ? 'Bình thường' : 'Thấp'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{r.category}</p>
                  <p className="text-sm leading-relaxed text-slate-600">{r.summary}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <UserCircle className="size-3.5 text-slate-400" aria-hidden />
                      Đối tượng: <strong className="text-slate-700">{r.targetLabel}</strong>
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3.5 text-slate-400" aria-hidden />
                      Người gửi: {r.reporterName} ({r.createdAt})
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                  <label className="sr-only" htmlFor={`report-status-${r.id}`}>
                    Trạng thái xử lý
                  </label>
                  <select
                    id={`report-status-${r.id}`}
                    value={r.status}
                    onChange={(e) => setStatus(r.id, e.target.value as ModerationReportStatus)}
                    className={adminSelect}
                  >
                    {REPORT_STATUS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {(() => {
                    const href = moderationDetailPath(listSlugForReport(r), r.id);
                    return r.targetType === 'session' && r.sessionDispute ? (
                      <Link
                        href={href}
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                      >
                        Chi tiết tranh chấp
                        <ChevronRight className="size-3.5" aria-hidden />
                      </Link>
                    ) : r.targetType === 'session' ? (
                      <span className="text-[11px] text-slate-400">Chưa có dữ liệu tranh chấp</span>
                    ) : (
                      <Link href={href} className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-primary hover:underline">
                        Mở chi tiết
                        <ChevronRight className="size-3.5" aria-hidden />
                      </Link>
                    );
                  })()}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
