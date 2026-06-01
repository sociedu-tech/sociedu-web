'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatDisplayDate } from '@/lib/formatDisplayDate';
import { AlertTriangle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import type { BookingProgramItem } from '@/features/dashboard/types/booking';
import type { ProgramLabels } from '@/features/dashboard/lib/programLabels';
import { programDetailPath } from '@/features/dashboard/lib/programLabels';
import { getProgramChatPeerId } from '@/features/dashboard/lib/programChat';
import { pickPackageLabel } from '@/lib/resolveOrderPackageNames';
import {
  PROGRAM_REPORT_REASONS,
  programReportTargetTitle,
  submitProgramReport,
  type ProgramReportTargetType,
} from '@/features/dashboard/lib/programReport';
import { trustService } from '@/services/trustService';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

type ReportScope = 'all' | 'session';

type TrustReportRow = {
  id: string;
  type: string;
  entityId: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
  resolutionNote?: string | null;
};

const TRUST_STATUS_LABEL: Record<string, string> = {
  open: 'Chờ xử lý',
  in_review: 'Đang xem xét',
  resolved: 'Đã xử lý',
  rejected: 'Từ chối',
};

const TRUST_STATUS_CLASS: Record<string, string> = {
  open: 'bg-amber-50 text-amber-800 border-amber-200',
  in_review: 'bg-blue-50 text-blue-800 border-blue-200',
  resolved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-800 border-rose-200',
};

type Props = {
  item: BookingProgramItem;
  labels: ProgramLabels;
  orderPackageName?: string | null;
};

export function ProgramReportPageView({ item, labels, orderPackageName }: Props) {
  const toast = useToast();
  const packageName = pickPackageLabel(item.orderId, item.packageLabel, {}, orderPackageName);
  const detailHref = programDetailPath(item.bookingId);

  const searchParams = useSearchParams();
  const initSessionId = searchParams?.get('sessionId') || '';

  const [scope, setScope] = useState<ReportScope>(initSessionId ? 'session' : 'all');
  const [sessionId, setSessionId] = useState(initSessionId || item.sessionRows[0]?.sessionId || '');
  const [reasonValue, setReasonValue] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submittedReports, setSubmittedReports] = useState<TrustReportRow[]>([]);
  const [loadingSubmitted, setLoadingSubmitted] = useState(true);

  const sessionIds = useMemo(
    () => new Set(item.sessionRows.map((row) => row.sessionId)),
    [item.sessionRows],
  );

  const loadSubmittedReports = async () => {
    setLoadingSubmitted(true);
    try {
      const page = await trustService.myReports(0, 50);
      const rows = (page.items as TrustReportRow[]).filter((report) => {
        if (report.entityId === item.bookingId) return true;
        return report.type === 'session' && sessionIds.has(report.entityId);
      });
      setSubmittedReports(rows);
    } catch {
      setSubmittedReports([]);
    } finally {
      setLoadingSubmitted(false);
    }
  };

  useEffect(() => {
    void loadSubmittedReports();
  }, [item.bookingId, sessionIds]);

  const reportedUserId = getProgramChatPeerId(item);
  const hasSessions = item.sessionRows.length > 0;

  const resolveTarget = (): { type: ProgramReportTargetType; entityId: string; title: string } => {
    if (scope === 'session') {
      const row = item.sessionRows.find((s) => s.sessionId === sessionId) ?? item.sessionRows[0];
      return {
        type: 'session',
        entityId: row.sessionId,
        title: programReportTargetTitle('session', row.title),
      };
    }
    return {
      type: 'booking',
      entityId: item.bookingId,
      title: programReportTargetTitle('booking', packageName),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonValue) {
      toast.error('Vui lòng chọn lý do báo cáo.');
      return;
    }
    if (scope === 'session' && !sessionId) {
      toast.error('Vui lòng chọn buổi học cần báo cáo.');
      return;
    }

    const target = resolveTarget();
    setSubmitting(true);
    try {
      await submitProgramReport({
        type: target.type,
        entityId: target.entityId,
        reportedUserId,
        reasonValue,
        description,
      });
      setDone(true);
      toast.success('Đã gửi báo cáo. Admin sẽ xem xét và xử lý.');
      void loadSubmittedReports();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không gửi được báo cáo.');
    } finally {
      setSubmitting(false);
    }
  };

  const targetPreview = resolveTarget();

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col space-y-6 pb-8">
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
          <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <p className="text-sm text-slate-600">
              {packageName} · {labels.counterparty}: {item.counterpartyLabel}
            </p>
          </div>
        </div>

        <div className="mb-6 space-y-3 border-b border-slate-100 pb-6">
          <h2 className="text-sm font-semibold text-slate-900">Báo cáo vi phạm đã gửi</h2>
          {loadingSubmitted ? (
            <div className="flex justify-center py-6">
              <Loader2 className="size-6 animate-spin text-slate-400" />
            </div>
          ) : submittedReports.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-center text-sm text-slate-500">
              Chưa có báo cáo vi phạm nào cho lộ trình này.
            </p>
          ) : (
            <ul className="space-y-3">
              {submittedReports.map((report) => (
                <li
                  key={report.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{report.reason}</span>
                    <span
                      className={cn(
                        'inline-flex rounded-full border px-2 py-0.5 text-2xs font-semibold',
                        TRUST_STATUS_CLASS[report.status] ?? 'bg-slate-100 text-slate-700 border-slate-200',
                      )}
                    >
                      {TRUST_STATUS_LABEL[report.status] ?? report.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{report.description}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="size-3.5" />
                    {formatDisplayDate(report.createdAt)}
                  </p>
                  {report.resolutionNote ? (
                    <p className="mt-2 rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-2 text-xs text-slate-700">
                      Phản hồi admin: {report.resolutionNote}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        {done ? (
          <div className="space-y-5 py-4 text-center">
            <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
            <p className="text-sm text-slate-600">
              Báo cáo của bạn đã được ghi nhận. Đội vận hành sẽ xem xét trong mục Báo cáo &amp; tranh
              chấp.
            </p>
            <Link
              href={detailHref}
              className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Về chi tiết lộ trình
            </Link>
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-slate-900">Phạm vi báo cáo</legend>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40 has-[:checked]:border-indigo-300 has-[:checked]:bg-indigo-50/60">
                <input
                  type="radio"
                  name="report-scope"
                  value="all"
                  checked={scope === 'all'}
                  onChange={() => setScope('all')}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-medium text-slate-900">Toàn bộ lộ trình</span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    Báo cáo vấn đề liên quan đến cả gói mentoring này.
                  </span>
                </span>
              </label>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/40 has-[:checked]:border-indigo-300 has-[:checked]:bg-indigo-50/60 ${!hasSessions ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <input
                  type="radio"
                  name="report-scope"
                  value="session"
                  checked={scope === 'session'}
                  disabled={!hasSessions}
                  onChange={() => setScope('session')}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-medium text-slate-900">Một buổi học cụ thể</span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {hasSessions
                      ? 'Chọn buổi học bạn muốn báo cáo bên dưới.'
                      : 'Lộ trình chưa có buổi học nào để báo cáo riêng.'}
                  </span>
                </span>
              </label>
            </fieldset>

            {scope === 'session' && hasSessions ? (
              <div>
                <label htmlFor="report-session" className="mb-1 block text-sm font-medium text-slate-700">
                  Buổi học
                </label>
                <select
                  id="report-session"
                  required
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  {item.sessionRows.map((row) => (
                    <option key={row.sessionId} value={row.sessionId}>
                      {row.title} · {row.startAt} · {row.status}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Đối tượng: <span className="font-medium text-slate-900">{targetPreview.title}</span>
            </p>

            <div>
              <label htmlFor="report-reason" className="mb-1 block text-sm font-medium text-slate-700">
                Lý do báo cáo
              </label>
              <select
                id="report-reason"
                required
                value={reasonValue}
                onChange={(e) => setReasonValue(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Chọn lý do…</option>
                {PROGRAM_REPORT_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="report-description" className="mb-1 block text-sm font-medium text-slate-700">
                Mô tả chi tiết
              </label>
              <textarea
                id="report-description"
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả sự việc để admin xử lý chính xác hơn…"
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
              <Link
                href={detailHref}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Hủy
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                Gửi báo cáo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
