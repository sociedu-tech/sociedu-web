'use client';

import Link from 'next/link';
import { CalendarClock, ExternalLink, FileText, Loader2, Video } from 'lucide-react';
import { useState } from 'react';
import type { DashboardSessionRow } from '@/features/dashboard/types/booking';
import type { SessionReportRequest } from '@/services/sessionReportService';
import type { SessionReportPerspective } from '@/features/dashboard/ui/programs/SessionScheduleReportCells';
import { findReportForSession } from '@/features/dashboard/ui/programs/SessionScheduleReportCells';
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
  isTerminalSessionStatus,
  mentorSessionStatusOptions,
  normalizeSessionStatus,
  sessionStatusBadgeClass,
  sessionStatusLabel,
} from '@/features/dashboard/lib/sessionStatusUi';
import { SessionConfirmActions } from '@/features/dashboard/views/sessions/SessionConfirmActions';
import { bookingService } from '@/services/bookingService';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

type Props = {
  bookingId: string;
  sessions: DashboardSessionRow[];
  reportRequests: SessionReportRequest[];
  perspective: SessionReportPerspective;
  onRefresh: () => void;
  onEditSchedule: (row: DashboardSessionRow) => void;
};

export function ProgramSessionList({
  bookingId,
  sessions,
  reportRequests,
  perspective,
  onRefresh,
  onEditSchedule,
}: Props) {
  if (sessions.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500">
        Chưa có buổi học nào trong gói này.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {sessions.map((row, index) => (
        <ProgramSessionCard
          key={row.sessionId}
          index={index + 1}
          total={sessions.length}
          row={row}
          bookingId={bookingId}
          report={findReportForSession(reportRequests, row.sessionId)}
          perspective={perspective}
          onRefresh={onRefresh}
          onEditSchedule={onEditSchedule}
        />
      ))}
    </ul>
  );
}

const SESSION_ACCENT: Record<ReturnType<typeof normalizeSessionStatus>, string> = {
  pending: 'border-l-slate-300',
  scheduled: 'border-l-blue-500',
  in_progress: 'border-l-violet-500',
  awaiting_confirmation: 'border-l-amber-500',
  completed: 'border-l-emerald-500',
  canceled: 'border-l-rose-400',
  cancelled: 'border-l-rose-400',
  disputed: 'border-l-orange-500',
  no_show: 'border-l-zinc-400',
};

function ProgramSessionCard({
  index,
  total,
  row,
  bookingId,
  report,
  perspective,
  onRefresh,
  onEditSchedule,
}: {
  index: number;
  total: number;
  row: DashboardSessionRow;
  bookingId: string;
  report?: SessionReportRequest;
  perspective: SessionReportPerspective;
  onRefresh: () => void;
  onEditSchedule: (row: DashboardSessionRow) => void;
}) {
  const toast = useToast();
  const isMentor = perspective === 'mentor';
  const [statusUpdating, setStatusUpdating] = useState(false);
  const statusOptions = mentorSessionStatusOptions(row.rawStatus);
  const canEditSchedule = isMentor && !isTerminalSessionStatus(row.rawStatus);

  const handleStatusChange = async (nextStatus: string) => {
    if (nextStatus === row.rawStatus.toLowerCase()) return;
    setStatusUpdating(true);
    try {
      await bookingService.updateSession(bookingId, row.sessionId, {
        status: nextStatus,
        cancelReason: nextStatus === 'canceled' ? 'Mentor cập nhật trạng thái' : undefined,
      });
      toast.success(`Đã chuyển sang "${sessionStatusLabel(nextStatus)}"`);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không cập nhật được trạng thái.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const statusKey = normalizeSessionStatus(row.rawStatus);
  const accentClass = SESSION_ACCENT[statusKey];

  return (
    <li
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-200/90 border-l-[3px] bg-white shadow-sm transition hover:shadow-md',
        accentClass,
      )}
    >
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-6">
        <div className="min-w-0 space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-100 text-[10px] font-bold leading-tight text-slate-600">
              <span className="text-xs">{index}</span>
              <span className="font-normal text-slate-400">/{total}</span>
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-900">{row.title}</h3>
                {!isMentor ? (
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2 py-0.5 text-2xs font-semibold ring-1 ring-inset lg:hidden',
                      sessionStatusBadgeClass(row.rawStatus),
                    )}
                  >
                    {sessionStatusLabel(row.rawStatus)}
                  </span>
                ) : null}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1">
                  <CalendarClock className="size-3.5 text-slate-400" aria-hidden />
                  {row.startAt}
                  {row.endAt !== '—' ? ` → ${row.endAt}` : ''}
                </span>
                {row.meetingUrl ? (
                  <a
                    href={row.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-primary/5 px-2 py-1 font-semibold text-primary hover:bg-primary/10"
                  >
                    <Video className="size-3.5" aria-hidden />
                    Vào phòng học
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                ) : (
                  <span className="rounded-lg bg-slate-50 px-2 py-1 text-slate-400">Chưa có link họp</span>
                )}
              </div>
            </div>
          </div>

          <SessionReportStrip bookingId={bookingId} sessionId={row.sessionId} report={report} perspective={perspective} />
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 lg:border-t-0 lg:pt-0">
          {isMentor ? (
            <label className="flex flex-col gap-1.5">
              <span className="text-2xs font-semibold tracking-wide text-slate-500">Trạng thái</span>
              <div className="relative">
                <select
                  value={row.rawStatus.toLowerCase()}
                  disabled={statusUpdating || statusOptions.length <= 1}
                  onChange={(e) => void handleStatusChange(e.target.value)}
                  className={cn(
                    'w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-9 text-sm font-semibold outline-none transition',
                    'focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                  )}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {statusUpdating ? (
                  <Loader2 className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-slate-400" />
                ) : null}
              </div>
            </label>
          ) : (
            <span
              className={cn(
                'hidden items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold ring-1 ring-inset lg:inline-flex',
                sessionStatusBadgeClass(row.rawStatus),
              )}
            >
              {sessionStatusLabel(row.rawStatus)}
            </span>
          )}

          {canEditSchedule ? (
            <button
              type="button"
              onClick={() => onEditSchedule(row)}
              className={cn(
                'inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition',
                row.scheduledAtIso
                  ? 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  : 'border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10',
              )}
            >
              <CalendarClock className="size-3.5" aria-hidden />
              {row.scheduledAtIso ? 'Sửa lịch' : 'Lên lịch'}
            </button>
          ) : null}
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">
        <SessionConfirmActions row={row} onUpdated={onRefresh} />
      </div>
    </li>
  );
}

function SessionReportStrip({
  bookingId,
  sessionId,
  report,
  perspective,
}: {
  bookingId: string;
  sessionId: string;
  report?: SessionReportRequest;
  perspective: SessionReportPerspective;
}) {
  const isMentor = perspective === 'mentor';
  const isBuyer = perspective === 'buyer';

  if (!report) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-2 text-xs">
        <FileText className="size-3.5 text-slate-400" aria-hidden />
        <span className="text-slate-500">Chưa có báo cáo buổi học</span>
        {isMentor ? (
          <Link
            href={programSessionReportNewPath(bookingId, sessionId)}
            className="ml-auto font-semibold text-primary hover:underline"
          >
            Yêu cầu báo cáo
          </Link>
        ) : null}
      </div>
    );
  }

  const canSubmit = isBuyer && (report.status === 'PENDING_SUBMISSION' || report.status === 'REJECTED');
  const canReview = isMentor && report.status === 'SUBMITTED';

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs">
      <FileText className="size-3.5 text-slate-400" aria-hidden />
      <span
        className={cn(
          'rounded-full border px-2 py-0.5 font-semibold',
          SESSION_REPORT_STATUS_CLASS[report.status],
        )}
      >
        {SESSION_REPORT_STATUS_LABEL[report.status]}
      </span>
      <Link href={programSessionReportPath(bookingId, report.id)} className="font-semibold text-primary hover:underline">
        Xem báo cáo
      </Link>
      {canSubmit ? (
        <Link
          href={programSessionReportSubmitPath(bookingId, report.id)}
          className="font-semibold text-indigo-700 hover:underline"
        >
          {report.status === 'REJECTED' ? 'Nộp lại' : 'Nộp báo cáo'}
        </Link>
      ) : null}
      {canReview ? (
        <Link
          href={programSessionReportReviewPath(bookingId, report.id)}
          className="font-semibold text-indigo-700 hover:underline"
        >
          Duyệt báo cáo
        </Link>
      ) : null}
    </div>
  );
}
