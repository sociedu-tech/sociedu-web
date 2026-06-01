'use client';

import Link from 'next/link';
import type { SessionReportRequest } from '@/services/sessionReportService';
import {
  programSessionReportNewPath,
  programSessionReportPath,
  programSessionReportReviewPath,
  programSessionReportSubmitPath,
} from '@/features/dashboard/lib/programLabels';
import {
  SESSION_REPORT_STATUS_CLASS,
  SESSION_REPORT_STATUS_LABEL,
} from '@/features/dashboard/lib/sessionReportUi';
import {
  dashboardTableActionLink,
  dashboardTableActionMuted,
  dashboardTableCell,
} from '@/features/dashboard/ui/DashboardTable';
import { cn } from '@/lib/utils';

export type SessionReportPerspective = 'buyer' | 'mentor' | 'admin';

/** Báo cáo gắn buổi học — ưu tiên bản cập nhật gần nhất. */
export function findReportForSession(
  requests: SessionReportRequest[],
  sessionId: string,
): SessionReportRequest | undefined {
  const matched = requests.filter((r) => r.sessionId === sessionId);
  if (matched.length === 0) return undefined;
  return [...matched].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )[0];
}

export function orphanSessionReports(requests: SessionReportRequest[]): SessionReportRequest[] {
  return requests.filter((r) => !r.sessionId);
}

const submitBtnClass =
  'inline-flex whitespace-nowrap rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700';

const submitAgainBtnClass =
  'inline-flex whitespace-nowrap rounded-lg bg-amber-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700';

type RowActionsProps = {
  bookingId: string;
  sessionId: string;
  report?: SessionReportRequest;
  perspective: SessionReportPerspective;
  loading?: boolean;
};

/** Cột báo cáo gắn vào bảng lịch buổi học. */
export function SessionScheduleReportCells({
  bookingId,
  sessionId,
  report,
  perspective,
  loading = false,
}: RowActionsProps) {
  if (loading) {
    return (
      <>
        <td className={dashboardTableCell}>…</td>
        <td className={dashboardTableCell}>…</td>
        <td className={dashboardTableCell}>…</td>
        <td className={dashboardTableCell}>…</td>
      </>
    );
  }

  if (!report) {
    return (
      <>
        <td className={dashboardTableCell}>
          <span className={dashboardTableActionMuted}>Chưa có</span>
        </td>
        <td className={dashboardTableCell}>
          <span className={dashboardTableActionMuted}>—</span>
        </td>
        <td className={dashboardTableCell}>
          {perspective === 'mentor' ? (
            <Link href={programSessionReportNewPath(bookingId, sessionId)} className={dashboardTableActionLink}>
              Yêu cầu báo cáo
            </Link>
          ) : (
            <span className={dashboardTableActionMuted}>—</span>
          )}
        </td>
        <td className={dashboardTableCell}>
          <span className={dashboardTableActionMuted}>—</span>
        </td>
      </>
    );
  }

  const canSubmit =
    perspective === 'buyer' &&
    (report.status === 'PENDING_SUBMISSION' || report.status === 'REJECTED');
  const canReview = perspective === 'mentor' && report.status === 'SUBMITTED';

  return (
    <>
      <td className={dashboardTableCell}>
        <span
          className={cn(
            'inline-flex max-w-full truncate whitespace-nowrap rounded-full border px-2 py-0.5 text-2xs font-semibold',
            SESSION_REPORT_STATUS_CLASS[report.status],
          )}
          title={SESSION_REPORT_STATUS_LABEL[report.status]}
        >
          {SESSION_REPORT_STATUS_LABEL[report.status]}
        </span>
      </td>
      <td className={dashboardTableCell}>
        <Link href={programSessionReportPath(bookingId, report.id)} className={dashboardTableActionLink}>
          Xem
        </Link>
      </td>
      <td className={dashboardTableCell}>
        {canSubmit ? (
          <Link
            href={programSessionReportSubmitPath(bookingId, report.id)}
            className={report.status === 'REJECTED' ? submitAgainBtnClass : submitBtnClass}
          >
            {report.status === 'REJECTED' ? 'Nộp lại' : 'Nộp báo cáo'}
          </Link>
        ) : (
          <span className={dashboardTableActionMuted}>—</span>
        )}
      </td>
      <td className={dashboardTableCell}>
        {canReview ? (
          <Link href={programSessionReportReviewPath(bookingId, report.id)} className={submitBtnClass}>
            Duyệt
          </Link>
        ) : (
          <span className={dashboardTableActionMuted}>—</span>
        )}
      </td>
    </>
  );
}
