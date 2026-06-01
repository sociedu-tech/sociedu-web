'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ExternalLink, Loader2, XCircle } from 'lucide-react';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useAuth } from '@/context/AuthContext';
import { ROLES, normalizeRole } from '@/constants/roles';
import { useProgramDetailPage } from '@/features/dashboard/hooks/useProgramDetailPage';
import { useSessionReportRequest } from '@/features/dashboard/hooks/useSessionReportRequest';
import {
  programDetailPath,
  programSessionReportReviewPath,
  programSessionReportSubmitPath,
} from '@/features/dashboard/lib/programLabels';
import {
  SESSION_REPORT_STATUS_CLASS,
  SESSION_REPORT_STATUS_LABEL,
  formatSessionReportDate,
} from '@/features/dashboard/lib/sessionReportUi';
import {
  DashboardPage,
  DashboardSurface,
  dashboardBtnPrimary,
  dashboardBtnSecondary,
  dashboardInput,
  dashboardLabel,
} from '@/features/dashboard/ui/DashboardPrimitives';
import { sessionReportService } from '@/services/sessionReportService';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

function BackLink({ bookingId, label = 'Quay lại lộ trình' }: { bookingId: string; label?: string }) {
  return (
    <Link
      href={programDetailPath(bookingId)}
      className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  );
}

function useProgramPerspective() {
  const { userRole } = useAuth();
  const role = normalizeRole(userRole);
  if (role === ROLES.MENTOR) return 'mentor' as const;
  if (role === ROLES.ADMIN) return 'admin' as const;
  return 'buyer' as const;
}

export function SessionReportViewPage() {
  const params = useParams();
  const bookingId = String(params?.bookingId ?? '');
  const requestId = String(params?.requestId ?? '');
  const perspective = useProgramPerspective();
  const { request, loading, error, refresh } = useSessionReportRequest(bookingId, requestId);
  const { item } = useProgramDetailPage(bookingId, perspective === 'mentor' ? 'mentor' : 'buyer');

  if (loading && !request) return <PageLoadingState label="Đang tải báo cáo…" />;
  if (error || !request) {
    return (
      <DashboardPage>
        <ErrorMessage message={error ?? 'Không tìm thấy báo cáo.'} onRetry={refresh} />
      </DashboardPage>
    );
  }

  const sessionTitle =
    item?.sessionRows.find((s) => s.sessionId === request.sessionId)?.title ?? '—';

  return (
    <DashboardPage>
      <BackLink bookingId={bookingId} />
      <DashboardSurface className="space-y-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-semibold tracking-wider text-slate-500">Chi tiết báo cáo buổi học</p>
            <h1 className="text-xl font-semibold text-slate-900">{request.title}</h1>
            <p className="text-sm text-slate-600">Buổi học: {sessionTitle}</p>
          </div>
          <span
            className={cn(
              'inline-flex rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap',
              SESSION_REPORT_STATUS_CLASS[request.status],
            )}
          >
            {SESSION_REPORT_STATUS_LABEL[request.status]}
          </span>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-semibold text-slate-500">Hạn nộp</dt>
            <dd className="mt-1 text-sm text-slate-800">{formatSessionReportDate(request.dueDate)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-slate-500">Yêu cầu lúc</dt>
            <dd className="mt-1 text-sm text-slate-800">{formatSessionReportDate(request.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-slate-500">Cập nhật</dt>
            <dd className="mt-1 text-sm text-slate-800">{formatSessionReportDate(request.updatedAt)}</dd>
          </div>
        </dl>

        {request.description ? (
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Mô tả yêu cầu</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{request.description}</p>
          </div>
        ) : null}

        {request.menteeContent ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Nội dung học viên nộp</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{request.menteeContent}</p>
            {request.menteeAttachmentUrl ? (
              <a
                href={request.menteeAttachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <ExternalLink className="size-4" />
                Mở tài liệu đính kèm
              </a>
            ) : null}
          </div>
        ) : null}

        {request.mentorFeedback ? (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
            <h2 className="text-sm font-semibold text-indigo-900">Phản hồi mentor</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{request.mentorFeedback}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {perspective === 'buyer' &&
          (request.status === 'PENDING_SUBMISSION' || request.status === 'REJECTED') ? (
            <Link href={programSessionReportSubmitPath(bookingId, requestId)} className={dashboardBtnPrimary}>
              {request.status === 'REJECTED' ? 'Nộp lại báo cáo' : 'Viết báo cáo'}
            </Link>
          ) : null}
          {perspective === 'mentor' && request.status === 'SUBMITTED' ? (
            <Link href={programSessionReportReviewPath(bookingId, requestId)} className={dashboardBtnPrimary}>
              Duyệt báo cáo
            </Link>
          ) : null}
        </div>
      </DashboardSurface>
    </DashboardPage>
  );
}

export function SessionReportSubmitPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const bookingId = String(params?.bookingId ?? '');
  const requestId = String(params?.requestId ?? '');
  const { request, loading, error, refresh } = useSessionReportRequest(bookingId, requestId);
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (request) {
      setContent(request.menteeContent ?? '');
      setAttachment(request.menteeAttachmentUrl ?? '');
    }
  }, [request]);

  if (loading && !request) return <PageLoadingState label="Đang tải…" />;
  if (error || !request) {
    return (
      <DashboardPage>
        <ErrorMessage message={error ?? 'Không tìm thấy yêu cầu.'} onRetry={refresh} />
      </DashboardPage>
    );
  }

  if (request.status !== 'PENDING_SUBMISSION' && request.status !== 'REJECTED') {
    return (
      <DashboardPage>
        <BackLink bookingId={bookingId} />
        <ErrorMessage message="Yêu cầu này không còn ở trạng thái cho phép nộp báo cáo." />
      </DashboardPage>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung báo cáo.');
      return;
    }
    setSubmitting(true);
    try {
      await sessionReportService.submit(requestId, {
        content: content.trim(),
        attachmentUrl: attachment.trim() || undefined,
      });
      toast.success('Nộp báo cáo thành công.');
      router.push(programDetailPath(bookingId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không nộp được báo cáo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardPage>
      <BackLink bookingId={bookingId} />
      <DashboardSurface className="p-6">
        <h1 className="text-xl font-semibold text-slate-900">Viết báo cáo học tập</h1>
        <p className="mt-1 text-sm text-slate-600">{request.title}</p>
        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="report-content" className={dashboardLabel}>
              Nội dung báo cáo (*)
            </label>
            <textarea
              id="report-content"
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tóm tắt buổi học, kết quả, khó khăn…"
              className={cn(dashboardInput, 'min-h-[180px] resize-y')}
            />
          </div>
          <div>
            <label htmlFor="report-attachment" className={dashboardLabel}>
              Link đính kèm (tùy chọn)
            </label>
            <input
              id="report-attachment"
              type="url"
              value={attachment}
              onChange={(e) => setAttachment(e.target.value)}
              placeholder="https://drive.google.com/…"
              className={dashboardInput}
            />
          </div>
          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
            <Link href={programDetailPath(bookingId)} className={dashboardBtnSecondary}>
              Hủy
            </Link>
            <button type="submit" disabled={submitting} className={dashboardBtnPrimary}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Đang nộp…
                </>
              ) : (
                'Nộp báo cáo'
              )}
            </button>
          </div>
        </form>
      </DashboardSurface>
    </DashboardPage>
  );
}

export function SessionReportReviewPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const bookingId = String(params?.bookingId ?? '');
  const requestId = String(params?.requestId ?? '');
  const { request, loading, error, refresh } = useSessionReportRequest(bookingId, requestId);
  const [status, setStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading && !request) return <PageLoadingState label="Đang tải…" />;
  if (error || !request) {
    return (
      <DashboardPage>
        <ErrorMessage message={error ?? 'Không tìm thấy báo cáo.'} onRetry={refresh} />
      </DashboardPage>
    );
  }

  if (request.status !== 'SUBMITTED') {
    return (
      <DashboardPage>
        <BackLink bookingId={bookingId} />
        <ErrorMessage message="Báo cáo này không ở trạng thái chờ duyệt." />
      </DashboardPage>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await sessionReportService.review(requestId, { status, feedback: feedback.trim() || undefined });
      toast.success('Đã lưu phán quyết.');
      router.push(programDetailPath(bookingId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không duyệt được báo cáo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardPage>
      <BackLink bookingId={bookingId} />
      <DashboardSurface className="space-y-5 p-6">
        <h1 className="text-xl font-semibold text-slate-900">Duyệt báo cáo học tập</h1>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <p className="text-sm font-semibold text-slate-900">{request.title}</p>
          <p className="whitespace-pre-wrap text-sm text-slate-700">{request.menteeContent}</p>
          {request.menteeAttachmentUrl ? (
            <a
              href={request.menteeAttachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600"
            >
              <ExternalLink className="size-4" /> Tài liệu đính kèm
            </a>
          ) : null}
        </div>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setStatus('APPROVED')}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold',
                status === 'APPROVED'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 bg-white text-slate-600',
              )}
            >
              <CheckCircle2 className="size-4" /> Thông qua
            </button>
            <button
              type="button"
              onClick={() => setStatus('REJECTED')}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold',
                status === 'REJECTED'
                  ? 'border-rose-200 bg-rose-50 text-rose-800'
                  : 'border-slate-200 bg-white text-slate-600',
              )}
            >
              <XCircle className="size-4" /> Từ chối
            </button>
          </div>
          <div>
            <label htmlFor="review-feedback" className={dashboardLabel}>
              Nhận xét / gợi ý
            </label>
            <textarea
              id="review-feedback"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className={cn(dashboardInput, 'resize-y')}
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Link href={programDetailPath(bookingId)} className={dashboardBtnSecondary}>
              Hủy
            </Link>
            <button type="submit" disabled={submitting} className={dashboardBtnPrimary}>
              {submitting ? 'Đang lưu…' : 'Lưu phán quyết'}
            </button>
          </div>
        </form>
      </DashboardSurface>
    </DashboardPage>
  );
}

export function SessionReportCreatePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const bookingId = String(params?.bookingId ?? '');
  const presetSessionId = searchParams?.get('sessionId') ?? '';
  const { item, loading } = useProgramDetailPage(bookingId, 'mentor');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (presetSessionId) setSessionId(presetSessionId);
  }, [presetSessionId]);

  if (loading && !item) return <PageLoadingState label="Đang tải lộ trình…" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề.');
      return;
    }
    setSubmitting(true);
    try {
      await sessionReportService.createRequest(bookingId, {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        sessionId: sessionId || undefined,
      });
      toast.success('Tạo yêu cầu báo cáo thành công.');
      router.push(programDetailPath(bookingId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không tạo được yêu cầu.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardPage>
      <BackLink bookingId={bookingId} />
      <DashboardSurface className="p-6">
        <h1 className="text-xl font-semibold text-slate-900">Tạo yêu cầu nộp báo cáo</h1>
        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="req-title" className={dashboardLabel}>
              Tiêu đề (*)
            </label>
            <input
              id="req-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={dashboardInput}
              placeholder="Báo cáo kết quả buổi 1"
            />
          </div>
          <div>
            <label htmlFor="req-desc" className={dashboardLabel}>
              Mô tả
            </label>
            <textarea
              id="req-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(dashboardInput, 'resize-y')}
            />
          </div>
          <div>
            <label htmlFor="req-session" className={dashboardLabel}>
              Buổi học (tùy chọn)
            </label>
            <select
              id="req-session"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className={dashboardInput}
            >
              <option value="">— Không gắn buổi cụ thể —</option>
              {item?.sessionRows.map((s) => (
                <option key={s.sessionId} value={s.sessionId}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="req-due" className={dashboardLabel}>
              Hạn nộp
            </label>
            <input
              id="req-due"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={dashboardInput}
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Link href={programDetailPath(bookingId)} className={dashboardBtnSecondary}>
              Hủy
            </Link>
            <button type="submit" disabled={submitting} className={dashboardBtnPrimary}>
              {submitting ? 'Đang tạo…' : 'Tạo yêu cầu'}
            </button>
          </div>
        </form>
      </DashboardSurface>
    </DashboardPage>
  );
}
