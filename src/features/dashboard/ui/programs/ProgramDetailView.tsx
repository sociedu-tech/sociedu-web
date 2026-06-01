'use client';

import Link from 'next/link';
import { Plus, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookingProgramItem, DashboardSessionRow } from '@/features/dashboard/types/booking';
import type { ServiceOrderDto } from '@/features/dashboard/types/serviceOrder';
import type { ProgramLabels } from '@/features/dashboard/lib/programLabels';
import { buildProgramOrderHref, buildProgramReportHref, programSessionReportPath, programSessionReportReviewPath, programSessionReportSubmitPath } from '@/features/dashboard/lib/programLabels';
import {
  buildChatThreadUrl,
  canOpenProgramChat,
  getProgramChatPeerId,
  openProgramChat,
} from '@/features/dashboard/lib/programChat';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';
import { useToast } from '@/context/ToastContext';
import { orphanSessionReports } from '@/features/dashboard/ui/programs/SessionScheduleReportCells';
import {
  SESSION_REPORT_STATUS_CLASS,
  SESSION_REPORT_STATUS_LABEL,
} from '@/features/dashboard/lib/sessionReportUi';
import { reviewService } from '@/services/reviewService';
import { pickPackageLabel } from '@/lib/resolveOrderPackageNames';
import { bookingService } from '@/services/bookingService';
import type { SessionReportRequest } from '@/services/sessionReportService';
import { ProgramSessionList } from '@/features/dashboard/ui/programs/ProgramSessionList';
import { ProgramDetailOverview, ProgramDetailSidebar } from '@/features/dashboard/ui/programs/ProgramDetailOverview';
import { buildSessionStats } from '@/features/dashboard/lib/programSessionStats';

type Props = {
  item: BookingProgramItem;
  order: ServiceOrderDto | null;
  reportRequests: SessionReportRequest[];
  onRefresh: () => void;
  labels: ProgramLabels;
  showChat?: boolean;
  showReview?: boolean;
  showReport?: boolean;
};

function toLocalDatetimeInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

export function ProgramDetailView({
  item,
  order,
  reportRequests,
  onRefresh,
  labels,
  showChat = true,
  showReview = false,
  showReport = true,
}: Props) {
  const router = useRouter();
  const toast = useToast();
  const [messaging, setMessaging] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleSession, setScheduleSession] = useState<DashboardSessionRow | null>(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [scheduledAtEnd, setScheduledAtEnd] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [scheduling, setScheduling] = useState(false);

  const [createSessionOpen, setCreateSessionOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionDescription, setNewSessionDescription] = useState('');
  const [creatingSession, setCreatingSession] = useState(false);

  const openScheduleEditor = useCallback((row: DashboardSessionRow) => {
    setScheduleSession(row);
    setScheduledAt(toLocalDatetimeInput(row.scheduledAtIso));
    setScheduledAtEnd(toLocalDatetimeInput(row.scheduledAtEndIso));
    setMeetingUrl(row.meetingUrl || '');
    setScheduleOpen(true);
  }, []);

  const handleScheduleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleSession) return;
    if (!scheduledAt) {
      toast.error('Vui lòng chọn ngày giờ học.');
      return;
    }
    if (scheduledAtEnd && new Date(scheduledAtEnd) <= new Date(scheduledAt)) {
      toast.error('Thời gian kết thúc phải sau thời gian bắt đầu.');
      return;
    }
    setScheduling(true);
    try {
      await bookingService.updateSession(item.bookingId, scheduleSession.sessionId, {
        scheduledAt: new Date(scheduledAt).toISOString(),
        scheduledAtEnd: scheduledAtEnd ? new Date(scheduledAtEnd).toISOString() : undefined,
        meetingUrl: meetingUrl.trim() || undefined,
      });
      toast.success('Đã cập nhật lịch buổi học.');
      setScheduleOpen(false);
      setScheduleSession(null);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không cập nhật được lịch học.');
    } finally {
      setScheduling(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề buổi học.');
      return;
    }
    setCreatingSession(true);
    try {
      await bookingService.createSession(item.bookingId, {
        title: newSessionTitle.trim(),
        description: newSessionDescription.trim() || undefined,
      });
      toast.success('Thêm buổi học mới thành công.');
      setCreateSessionOpen(false);
      setNewSessionTitle('');
      setNewSessionDescription('');
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không tạo được buổi học.');
    } finally {
      setCreatingSession(false);
    }
  };

  const packageName = pickPackageLabel(item.orderId, item.packageLabel, {}, order?.packageName);
  const orderHref = buildProgramOrderHref(labels, item.orderId);
  const reportHref = buildProgramReportHref(labels, item.bookingId);
  const chatAction = 'chatAction' in labels ? labels.chatAction : undefined;
  const chatPeerId = getProgramChatPeerId(item);
  const chatReady = canOpenProgramChat(item, order);
  const reportPerspective = item.sessionPerspective === 'mentor' ? 'mentor' : 'buyer';
  const unattachedReports = useMemo(() => orphanSessionReports(reportRequests), [reportRequests]);
  const sessionStats = useMemo(() => buildSessionStats(item.sessionRows), [item.sessionRows]);
  const isMentor = item.sessionPerspective === 'mentor';

  const handleMessage = async () => {
    if (!chatPeerId) {
      toast.error('Chưa có đủ thông tin để mở hội thoại.');
      return;
    }
    if (!chatReady) {
      toast.error('Chỉ có thể nhắn tin sau khi thanh toán thành công.');
      return;
    }
    setMessaging(true);
    try {
      const conversationId = await openProgramChat(item, order);
      router.push(
        buildChatThreadUrl(conversationId, item.counterpartyLabel, {
          contextType: 'booking',
          contextId: item.bookingId,
        }),
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không mở được hội thoại.');
    } finally {
      setMessaging(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <ProgramDetailOverview
        item={item}
        packageName={packageName}
        counterpartyLabel={item.counterpartyLabel}
        labels={labels}
        actions={{
          orderHref,
          reportHref,
          showReport,
          showChat,
          chatAction,
          chatDisabled: messaging || !chatPeerId || !chatReady,
          messaging,
          onMessage: () => void handleMessage(),
        }}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
        <section className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-5 py-4 shadow-sm">
            <div>
              <h2 className="text-base font-semibold text-slate-900">{labels.sessionList}</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {isMentor
                  ? 'Cập nhật trạng thái, lịch và link họp trên từng buổi.'
                  : 'Theo dõi lịch, báo cáo và xác nhận hoàn thành.'}
              </p>
            </div>
            {isMentor ? (
              <button
                type="button"
                onClick={() => setCreateSessionOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"
              >
                <Plus className="size-4" aria-hidden />
                Thêm buổi học
              </button>
            ) : null}
          </div>

          <ProgramSessionList
            bookingId={item.bookingId}
            sessions={item.sessionRows}
            reportRequests={reportRequests}
            perspective={reportPerspective}
            onRefresh={onRefresh}
            onEditSchedule={openScheduleEditor}
          />

          {unattachedReports.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-amber-200/70 bg-amber-50/40 shadow-sm">
              <div className="border-b border-amber-200/60 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                  Báo cáo không gắn buổi cụ thể
                </p>
              </div>
              <ul className="divide-y divide-amber-100/80 px-5">
                {unattachedReports.map((req) => (
                  <li key={req.id} className="flex flex-wrap items-center gap-3 py-3.5 text-sm">
                    <span className="font-medium text-slate-900">{req.title}</span>
                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 text-2xs font-semibold',
                        SESSION_REPORT_STATUS_CLASS[req.status],
                      )}
                    >
                      {SESSION_REPORT_STATUS_LABEL[req.status]}
                    </span>
                    <Link href={programSessionReportPath(item.bookingId, req.id)} className="text-primary hover:underline">
                      Xem
                    </Link>
                    {reportPerspective === 'buyer' &&
                    (req.status === 'PENDING_SUBMISSION' || req.status === 'REJECTED') ? (
                      <Link
                        href={programSessionReportSubmitPath(item.bookingId, req.id)}
                        className="font-semibold text-indigo-700 hover:underline"
                      >
                        {req.status === 'REJECTED' ? 'Nộp lại' : 'Nộp báo cáo'}
                      </Link>
                    ) : null}
                    {reportPerspective === 'mentor' && req.status === 'SUBMITTED' ? (
                      <Link
                        href={programSessionReportReviewPath(item.bookingId, req.id)}
                        className="font-semibold text-indigo-700 hover:underline"
                      >
                        Duyệt
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <ProgramDetailSidebar
          item={item}
          sessionStats={sessionStats}
          orphanReportCount={unattachedReports.length}
        />
      </div>

      {reviewOpen ? (
        <ReviewModal
          rating={rating}
          hoverRating={hoverRating}
          comment={comment}
          submitting={submittingReview}
          onClose={() => setReviewOpen(false)}
          onRating={setRating}
          onHover={setHoverRating}
          onComment={setComment}
          onSubmit={async () => {
            if (!reviewBookingId) return;
            setSubmittingReview(true);
            try {
              await reviewService.createReview(reviewBookingId, { rating, comment });
              setReviewOpen(false);
              setReviewBookingId(null);
              onRefresh();
            } catch {
              toast.error('Không gửi được đánh giá.');
            } finally {
              setSubmittingReview(false);
            }
          }}
        />
      ) : null}

      {scheduleOpen && scheduleSession ? (
        <ScheduleModal
          session={scheduleSession}
          scheduledAt={scheduledAt}
          scheduledAtEnd={scheduledAtEnd}
          meetingUrl={meetingUrl}
          scheduling={scheduling}
          onClose={() => setScheduleOpen(false)}
          onScheduledAt={setScheduledAt}
          onScheduledAtEnd={setScheduledAtEnd}
          onMeetingUrl={setMeetingUrl}
          onSubmit={(e) => void handleScheduleSave(e)}
        />
      ) : null}

      {createSessionOpen ? (
        <CreateSessionModal
          title={newSessionTitle}
          description={newSessionDescription}
          creating={creatingSession}
          onClose={() => setCreateSessionOpen(false)}
          onTitle={setNewSessionTitle}
          onDescription={setNewSessionDescription}
          onSubmit={(e) => void handleCreateSession(e)}
        />
      ) : null}
    </div>
  );
}

function ReviewModal({
  rating,
  hoverRating,
  comment,
  submitting,
  onClose,
  onRating,
  onHover,
  onComment,
  onSubmit,
}: {
  rating: number;
  hoverRating: number | null;
  comment: string;
  submitting: boolean;
  onClose: () => void;
  onRating: (n: number) => void;
  onHover: (n: number | null) => void;
  onComment: (s: string) => void;
  onSubmit: () => void;
}) {
  return (
    <ModalShell onClose={onClose} title="Đánh giá buổi học">
      <div className="flex flex-col items-center gap-1 py-2">
        <div className="flex items-center gap-2.5">
          {[1, 2, 3, 4, 5].map((starValue) => {
            const isFilled = hoverRating !== null ? starValue <= hoverRating : starValue <= rating;
            return (
              <button
                key={starValue}
                type="button"
                onClick={() => onRating(starValue)}
                onMouseEnter={() => onHover(starValue)}
                onMouseLeave={() => onHover(null)}
                className="p-0.5 transition-transform hover:scale-110"
                aria-label={`${starValue} sao`}
              >
                <Star
                  className="size-8"
                  style={{
                    fill: isFilled ? '#fbbf24' : 'transparent',
                    stroke: isFilled ? '#fbbf24' : '#cbd5e1',
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
      <textarea
        value={comment}
        onChange={(e) => onComment(e.target.value)}
        className="mb-4 mt-2 h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        placeholder="Bình luận (tuỳ chọn)"
      />
      <ModalActions onClose={onClose} submitLabel={submitting ? 'Đang gửi…' : 'Gửi đánh giá'} onSubmit={onSubmit} disabled={submitting} />
    </ModalShell>
  );
}

function ScheduleModal({
  session,
  scheduledAt,
  scheduledAtEnd,
  meetingUrl,
  scheduling,
  onClose,
  onScheduledAt,
  onScheduledAtEnd,
  onMeetingUrl,
  onSubmit,
}: {
  session: DashboardSessionRow;
  scheduledAt: string;
  scheduledAtEnd: string;
  meetingUrl: string;
  scheduling: boolean;
  onClose: () => void;
  onScheduledAt: (v: string) => void;
  onScheduledAtEnd: (v: string) => void;
  onMeetingUrl: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <ModalShell onClose={onClose} title="Sửa lịch & link họp" subtitle={session.title}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Bắt đầu *">
          <input
            type="datetime-local"
            required
            value={scheduledAt}
            onChange={(e) => onScheduledAt(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Kết thúc">
          <input
            type="datetime-local"
            value={scheduledAtEnd}
            onChange={(e) => onScheduledAtEnd(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Link phòng họp">
          <input
            type="url"
            value={meetingUrl}
            onChange={(e) => onMeetingUrl(e.target.value)}
            placeholder="https://meet.google.com/..."
            className={inputClass}
          />
        </Field>
        <p className="text-xs text-slate-500">
          Trạng thái buổi học cập nhật trực tiếp trên thẻ buổi — không cần chỉnh ở đây.
        </p>
        <ModalActions onClose={onClose} submitLabel={scheduling ? 'Đang lưu…' : 'Lưu lịch'} disabled={scheduling} />
      </form>
    </ModalShell>
  );
}

function CreateSessionModal({
  title,
  description,
  creating,
  onClose,
  onTitle,
  onDescription,
  onSubmit,
}: {
  title: string;
  description: string;
  creating: boolean;
  onClose: () => void;
  onTitle: (v: string) => void;
  onDescription: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <ModalShell onClose={onClose} title="Thêm buổi học mới">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Tiêu đề *">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            placeholder="Ví dụ: Hướng dẫn viết Proposal"
            className={inputClass}
          />
        </Field>
        <Field label="Mô tả">
          <textarea
            value={description}
            onChange={(e) => onDescription(e.target.value)}
            placeholder="Nội dung trao đổi dự kiến…"
            className={cn(inputClass, 'h-24 resize-none')}
          />
        </Field>
        <ModalActions onClose={onClose} submitLabel={creating ? 'Đang tạo…' : 'Tạo buổi học'} disabled={creating} />
      </form>
    </ModalShell>
  );
}

function ModalShell({
  onClose,
  title,
  subtitle,
  children,
}: {
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function ModalActions({
  onClose,
  onSubmit,
  submitLabel,
  disabled,
}: {
  onClose: () => void;
  onSubmit?: () => void;
  submitLabel: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
      <button type="button" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100" onClick={onClose}>
        Hủy
      </button>
      <button
        type="submit"
        disabled={disabled}
        onClick={onSubmit}
        className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15';
