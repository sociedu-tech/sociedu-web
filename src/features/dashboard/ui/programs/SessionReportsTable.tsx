'use client';

import Link from 'next/link';
import { Loader2, Plus } from 'lucide-react';
import type { SessionReportRequest } from '@/services/sessionReportService';
import type { DashboardSessionRow } from '@/features/dashboard/types/booking';
import {
  programSessionReportNewPath,
  programSessionReportPath,
  programSessionReportReviewPath,
  programSessionReportSubmitPath,
} from '@/features/dashboard/lib/programLabels';
import {
  SESSION_REPORT_STATUS_CLASS,
  SESSION_REPORT_STATUS_LABEL,
  formatSessionReportDate,
} from '@/features/dashboard/lib/sessionReportUi';
import {
  DashboardTableCard,
  dashboardTableActionLink,
  dashboardTableActionMuted,
  dashboardTableCell,
  dashboardTableCellTruncate,
  dashboardTableHeadCell,
  dashboardTableHeadClass,
  dashboardTableRowClass,
} from '@/features/dashboard/ui/DashboardTable';
import { cn } from '@/lib/utils';

type Props = {
  bookingId: string;
  requests: SessionReportRequest[];
  sessionRows?: DashboardSessionRow[];
  perspective: 'buyer' | 'mentor' | 'admin';
  loading?: boolean;
  showCreateAction?: boolean;
};

function sessionTitle(sessionRows: DashboardSessionRow[] | undefined, sessionId?: string | null): string {
  if (!sessionId) return '—';
  const row = sessionRows?.find((s) => s.sessionId === sessionId);
  return row?.title ?? sessionId.slice(0, 8);
}

export function SessionReportsTable({
  bookingId,
  requests,
  sessionRows,
  perspective,
  loading = false,
  showCreateAction = false,
}: Props) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
        Chưa có yêu cầu báo cáo nào.
      </p>
    );
  }

  return (
    <DashboardTableCard>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] table-fixed text-left text-sm">
          <thead>
            <tr className={dashboardTableHeadClass}>
              <th className={cn(dashboardTableHeadCell, 'w-[22%]')}>Tiêu đề</th>
              <th className={cn(dashboardTableHeadCell, 'w-[14%]')}>Buổi học</th>
              <th className={cn(dashboardTableHeadCell, 'w-[14%]')}>Trạng thái</th>
              <th className={cn(dashboardTableHeadCell, 'w-[12%]')}>Hạn nộp</th>
              <th className={cn(dashboardTableHeadCell, 'w-[12%]')}>Cập nhật</th>
              <th className={cn(dashboardTableHeadCell, 'w-[8%]')}>Xem</th>
              <th className={cn(dashboardTableHeadCell, 'w-[9%]')}>Nộp báo cáo</th>
              <th className={cn(dashboardTableHeadCell, 'w-[9%]')}>Duyệt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((req) => {
              const canSubmit =
                perspective === 'buyer' &&
                (req.status === 'PENDING_SUBMISSION' || req.status === 'REJECTED');
              const canReview = perspective === 'mentor' && req.status === 'SUBMITTED';
              const submitLabel =
                req.status === 'REJECTED' ? 'Nộp lại' : req.status === 'PENDING_SUBMISSION' ? 'Viết báo cáo' : '—';

              return (
                <tr key={req.id} className={dashboardTableRowClass}>
                  <td className={dashboardTableCellTruncate} title={req.title}>
                    <span className="font-medium text-slate-900">{req.title}</span>
                  </td>
                  <td className={dashboardTableCellTruncate} title={sessionTitle(sessionRows, req.sessionId)}>
                    {sessionTitle(sessionRows, req.sessionId)}
                  </td>
                  <td className={dashboardTableCell}>
                    <span
                      className={cn(
                        'inline-flex rounded-full border px-2 py-0.5 text-2xs font-semibold',
                        SESSION_REPORT_STATUS_CLASS[req.status],
                      )}
                    >
                      {SESSION_REPORT_STATUS_LABEL[req.status]}
                    </span>
                  </td>
                  <td className={dashboardTableCell}>{formatSessionReportDate(req.dueDate)}</td>
                  <td className={dashboardTableCell}>{formatSessionReportDate(req.updatedAt)}</td>
                  <td className={dashboardTableCell}>
                    <Link
                      href={programSessionReportPath(bookingId, req.id)}
                      className={dashboardTableActionLink}
                    >
                      Xem báo cáo
                    </Link>
                  </td>
                  <td className={dashboardTableCell}>
                    {canSubmit ? (
                      <Link
                        href={programSessionReportSubmitPath(bookingId, req.id)}
                        className={dashboardTableActionLink}
                      >
                        {submitLabel}
                      </Link>
                    ) : (
                      <span className={dashboardTableActionMuted}>—</span>
                    )}
                  </td>
                  <td className={dashboardTableCell}>
                    {canReview ? (
                      <Link
                        href={programSessionReportReviewPath(bookingId, req.id)}
                        className={dashboardTableActionLink}
                      >
                        Duyệt
                      </Link>
                    ) : (
                      <span className={dashboardTableActionMuted}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardTableCard>
  );
}

export function SessionReportsSectionHeader({
  bookingId,
  showCreateAction,
}: {
  bookingId: string;
  showCreateAction?: boolean;
}) {
  if (!showCreateAction) return null;
  return (
    <Link
      href={programSessionReportNewPath(bookingId)}
      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
    >
      <Plus className="size-3.5" />
      Tạo yêu cầu báo cáo
    </Link>
  );
}
