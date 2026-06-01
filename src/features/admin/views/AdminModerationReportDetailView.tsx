'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { adminBtnGhost, adminSelect } from '@/features/admin/ui/adminClasses';
import { DisputeProcessStepper } from '@/features/admin/ui/DisputeProcessStepper';
import { SessionDisputePanel } from '@/features/admin/ui/SessionDisputePanel';
import { SessionDisputeAdjudicationBar } from '@/features/admin/ui/SessionDisputeAdjudicationBar';
import type { AdminModerationReport, ModerationReportStatus } from '@/types';
import {
  listSlugForReport,
  moderationDetailPath,
  type ModerationListSlug,
} from '@/lib/moderationDetailRoutes';
import { useSessionDisputeAdjudication } from '@/features/admin/hooks/useSessionDisputeAdjudication';
import { adminModerationService } from '@/services/adminModerationService';
import { PageLoadingState } from '@/components/ui/PageLoadingState';

const REPORT_STATUS: { value: ModerationReportStatus; label: string }[] = [
  { value: 'open', label: 'Mới' },
  { value: 'in_review', label: 'Đang xử lý' },
  { value: 'resolved', label: 'Đã xử lý' },
  { value: 'dismissed', label: 'Đã bỏ qua' },
];

const LIST_LABEL: Record<ModerationListSlug, string> = {
  all: 'Tất cả',
  people: 'Người dùng & mentor',
  reviews: 'Đánh giá',
  sessions: 'Lộ trình & buổi học',
};

function listHref(slug: ModerationListSlug) {
  return slug === 'all' ? '/dashboard/moderation' : `/dashboard/moderation/${slug}`;
}

type Props = { listSlug: ModerationListSlug };

function ModerationReportDetailInner({
  initial,
  listSlug,
}: {
  initial: AdminModerationReport;
  listSlug: ModerationListSlug;
}) {
  const [status, setStatus] = useState(initial.status);
  const [resolutionNote, setResolutionNote] = useState(
    initial.sessionDispute?.adminResolutionNote ?? '',
  );
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    setStatus(initial.status);
    setResolutionNote(initial.sessionDispute?.adminResolutionNote ?? '');
  }, [initial.id, initial.status, initial.sessionDispute?.adminResolutionNote]);

  const {
    dispute,
    currentPhase,
    advanceFromEvidence,
    advanceToDecision,
    applyRuling,
    requestMoreEvidence,
  } = useSessionDisputeAdjudication({
    initialReport: initial,
    onReportMetaChange: ({ status: s }) => setStatus(s),
  });

  const expectedSlug = listSlugForReport(initial);
  const slugMismatch = expectedSlug !== listSlug;

  const merged: AdminModerationReport = {
    ...initial,
    status,
    sessionDispute: dispute ?? initial.sessionDispute,
  };

  const closedStage = merged.sessionDispute?.stages.find((s) => s.phase === 'closed');
  const isDisputeClosed = merged.sessionDispute?.currentPhase === 'closed' && Boolean(closedStage?.done);

  return (
    <div className="space-y-6">
      {slugMismatch ? (
        <div className="flex flex-wrap items-start gap-3 rounded-xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          <AlertTriangle className="size-5 shrink-0 text-amber-700" aria-hidden />
          <div className="min-w-0">
            <p className="font-semibold">URL không khớp loại báo cáo</p>
            <p className="mt-1 text-amber-900/90">
              Báo cáo này thuộc nhánh <strong>{LIST_LABEL[expectedSlug]}</strong>, không phải «{LIST_LABEL[listSlug]}».
            </p>
            <Link
              href={moderationDetailPath(expectedSlug, initial.id)}
              className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Mở đúng trang chi tiết →
            </Link>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Link href={listHref(listSlug)} className={`${adminBtnGhost} py-2 pl-2 pr-3`}>
          <ArrowLeft className="size-4" aria-hidden />
          Quay lại ({LIST_LABEL[listSlug]})
        </Link>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700">
          {initial.id}
        </span>
        <span className="text-xs text-slate-500">
          <span className="font-mono text-slate-700">/dashboard/moderation/{listSlug}/{initial.id}</span>
        </span>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{merged.category}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{merged.summary}</p>
            <p className="mt-2 text-xs text-slate-500">
              Người gửi: {merged.reporterName} · {merged.createdAt}
            </p>
          </div>
          <div className="shrink-0">
            <label className="sr-only" htmlFor="detail-report-status">
              Trạng thái
            </label>
            <select
              id="detail-report-status"
              value={merged.status}
              onChange={(e) => {
                const next = e.target.value as ModerationReportStatus;
                setStatus(next);
                void adminModerationService.resolve(initial.id, { status: next }).catch(() => undefined);
              }}
              className={adminSelect}
            >
              {REPORT_STATUS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(merged.targetType === 'session' || merged.targetType === 'booking') && merged.sessionDispute ? (
          <div className="mt-8 space-y-6">
            {!slugMismatch ? (
              <SessionDisputeAdjudicationBar
                currentPhase={currentPhase}
                isClosed={isDisputeClosed}
                advanceFromEvidence={advanceFromEvidence}
                advanceToDecision={advanceToDecision}
                applyRuling={applyRuling}
                requestMoreEvidence={requestMoreEvidence}
              />
            ) : null}
            <div className="rounded-2xl border border-slate-800 bg-[var(--color-dashboard-ink)] p-4 sm:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Tiến độ xử lý tranh chấp</p>
              <div className="mt-4">
                <DisputeProcessStepper
                  variant="dark"
                  stages={merged.sessionDispute.stages}
                  currentPhase={merged.sessionDispute.currentPhase}
                />
              </div>
            </div>
            <SessionDisputePanel detail={merged.sessionDispute} showStageList={false} />
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50 p-4">
              <label htmlFor="resolution-note-dispute" className="mb-1 block text-sm font-medium text-slate-700">
                Ghi chú xử lý (admin)
              </label>
              <textarea
                id="resolution-note-dispute"
                rows={3}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Ghi chú kết luận, hướng xử lý…"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <button
                type="button"
                disabled={savingNote}
                onClick={() => {
                  setSavingNote(true);
                  void adminModerationService
                    .resolve(initial.id, { status, resolutionNote: resolutionNote.trim() || undefined })
                    .then(() => undefined)
                    .catch(() => undefined)
                    .finally(() => setSavingNote(false));
                }}
                className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
              >
                {savingNote ? 'Đang lưu…' : 'Lưu ghi chú & trạng thái'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-slate-500">
              Loại báo cáo: <strong>{merged.targetLabel}</strong>
            </p>
            <div>
              <label htmlFor="resolution-note" className="mb-1 block text-sm font-medium text-slate-700">
                Ghi chú xử lý (admin)
              </label>
              <textarea
                id="resolution-note"
                rows={3}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Ghi chú kết luận, hướng xử lý…"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <button
                type="button"
                disabled={savingNote}
                onClick={() => {
                  setSavingNote(true);
                  void adminModerationService
                    .resolve(initial.id, { status, resolutionNote: resolutionNote.trim() || undefined })
                    .then(() => undefined)
                    .catch(() => undefined)
                    .finally(() => setSavingNote(false));
                }}
                className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
              >
                {savingNote ? 'Đang lưu…' : 'Lưu ghi chú & trạng thái'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminModerationReportDetailView({ listSlug }: Props) {
  const params = useParams();
  const id = typeof params?.reportId === 'string' ? params.reportId : '';
  const [report, setReport] = useState<AdminModerationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const row = await adminModerationService.getById(id);
        if (!cancelled) setReport(row);
      } catch (err: unknown) {
        if (!cancelled) {
          setReport(null);
          setError(err instanceof Error ? err.message : 'Không tải được báo cáo.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <PageLoadingState label="Đang tải báo cáo…" variant="cards" cardCount={2} />;
  }

  if (error || !report) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
        <p>{error ?? 'Không tìm thấy báo cáo.'}</p>
        <Link
          href={listHref(listSlug)}
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Về danh sách
        </Link>
      </div>
    );
  }

  return <ModerationReportDetailInner initial={report} listSlug={listSlug} />;
}
