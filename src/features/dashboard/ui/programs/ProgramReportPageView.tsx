'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
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
import { useToast } from '@/context/ToastContext';

type ReportScope = 'all' | 'session';

type Props = {
  item: BookingProgramItem;
  labels: ProgramLabels;
  orderPackageName?: string | null;
};

export function ProgramReportPageView({ item, labels, orderPackageName }: Props) {
  const toast = useToast();
  const packageName = pickPackageLabel(item.orderId, item.packageLabel, {}, orderPackageName);
  const detailHref = programDetailPath(item.bookingId);

  const [scope, setScope] = useState<ReportScope>('all');
  const [sessionId, setSessionId] = useState(item.sessionRows[0]?.sessionId ?? '');
  const [reasonValue, setReasonValue] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không gửi được báo cáo.');
    } finally {
      setSubmitting(false);
    }
  };

  const targetPreview = resolveTarget();

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      <Link
        href={detailHref}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Quay lại chi tiết lộ trình
      </Link>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
          <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Báo cáo</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">Gửi báo cáo</h1>
            <p className="mt-1 text-sm text-slate-600">
              {packageName} · {labels.counterparty}: {item.counterpartyLabel}
            </p>
          </div>
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
