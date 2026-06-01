'use client';

import Link from 'next/link';
import { Flag, Loader2, MessageSquare, ShoppingBag, User, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookingProgramItem, DashboardSessionRow } from '@/features/dashboard/types/booking';
import type { ServiceOrderDto } from '@/features/dashboard/types/serviceOrder';
import type { ProgramLabels } from '@/features/dashboard/lib/programLabels';
import { buildProgramOrderHref, buildProgramReportHref } from '@/features/dashboard/lib/programLabels';
import { SessionConfirmActions } from '@/features/dashboard/views/sessions/SessionConfirmActions';
import {
  buildChatThreadUrl,
  canOpenProgramChat,
  getProgramChatPeerId,
  openProgramChat,
} from '@/features/dashboard/lib/programChat';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useToast } from '@/context/ToastContext';
import {
  DashboardTableCard,
  dashboardTableCell,
  dashboardTableCellTruncate,
  dashboardTableHeadCell,
  dashboardTableHeadClass,
  dashboardTableRowClass,
  dashboardTableActionLink,
} from '@/features/dashboard/ui/DashboardTable';
import {
  findReportForSession,
  orphanSessionReports,
  SessionScheduleReportCells,
} from '@/features/dashboard/ui/programs/SessionScheduleReportCells';
import { programSessionReportPath, programSessionReportSubmitPath, programSessionReportReviewPath } from '@/features/dashboard/lib/programLabels';
import {
  SESSION_REPORT_STATUS_CLASS,
  SESSION_REPORT_STATUS_LABEL,
} from '@/features/dashboard/lib/sessionReportUi';
import { reviewService } from '@/services/reviewService';
import { pickPackageLabel } from '@/lib/resolveOrderPackageNames';
import { bookingService } from '@/services/bookingService';
import type { SessionReportRequest } from '@/services/sessionReportService';

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


  // States for Scheduling (Xếp lịch)
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleSession, setScheduleSession] = useState<DashboardSessionRow | null>(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [scheduledAtEnd, setScheduledAtEnd] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [sessionStatus, setSessionStatus] = useState('');
  const [scheduling, setScheduling] = useState(false);

  // States for Custom Session Creation (Thêm buổi học mới)
  const [createSessionOpen, setCreateSessionOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionDescription, setNewSessionDescription] = useState('');
  const [creatingSession, setCreatingSession] = useState(false);

  // States for Progress Update (Cập nhật tiến trình)
  const [progressOpen, setProgressOpen] = useState(false);
  const [progressVal, setProgressVal] = useState(0);
  const [updatingProgress, setUpdatingProgress] = useState(false);

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
      const isoScheduledAt = new Date(scheduledAt).toISOString();
      const isoScheduledAtEnd = scheduledAtEnd ? new Date(scheduledAtEnd).toISOString() : undefined;
      await bookingService.updateSession(item.bookingId, scheduleSession.sessionId, {
        scheduledAt: isoScheduledAt,
        scheduledAtEnd: isoScheduledAtEnd,
        meetingUrl: meetingUrl.trim() || undefined,
        status: sessionStatus || undefined,
        cancelReason: sessionStatus === 'canceled' ? 'Thay đổi trạng thái bởi Mentor' : undefined,
      });
      toast.success('Cập nhật buổi học thành công.');
      setScheduleOpen(false);
      setScheduleSession(null);
      setScheduledAt('');
      setScheduledAtEnd('');
      setMeetingUrl('');
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không xếp được lịch học.');
    } finally {
      setScheduling(false);
    }
  };

  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (progressVal < 0 || progressVal > 100) {
      toast.error('Tiến trình phải từ 0 đến 100%.');
      return;
    }
    setUpdatingProgress(true);
    try {
      await bookingService.updateProgress(item.bookingId, progressVal);
      toast.success('Cập nhật tiến trình thành công.');
      setProgressOpen(false);
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không cập nhật được tiến trình.');
    } finally {
      setUpdatingProgress(false);
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


  const packageName = pickPackageLabel(
    item.orderId,
    item.packageLabel,
    {},
    order?.packageName,
  );

  const orderHref = buildProgramOrderHref(labels, item.orderId);
  const reportHref = buildProgramReportHref(labels, item.bookingId);

  const chatAction = 'chatAction' in labels ? labels.chatAction : undefined;
  const chatPeerId = getProgramChatPeerId(item);
  const chatReady = canOpenProgramChat(item, order);
  const reportPerspective = item.sessionPerspective === 'mentor' ? 'mentor' : 'buyer';
  const unattachedReports = useMemo(() => orphanSessionReports(reportRequests), [reportRequests]);

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
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 border-b border-slate-200/90 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{packageName}</h1>
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <User className="size-4 text-slate-400" />
            {labels.counterparty}:{' '}
            <span className="font-medium text-slate-900">{item.counterpartyLabel}</span>
          </p>
          <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {item.bookingStatusLabel}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {orderHref ? (
            <Link
              href={orderHref}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ShoppingBag className="size-4" />
              Xem thông tin đơn hàng
            </Link>
          ) : null}
          {showReport && reportHref ? (
            <Link
              href={reportHref}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
            >
              <Flag className="size-4" />
              Báo cáo vi phạm
            </Link>
          ) : null}
          {item.sessionPerspective === 'mentor' && (
            <button
              type="button"
              onClick={() => {
                setProgressVal(item.progressPercent);
                setProgressOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              Cập nhật tiến trình
            </button>
          )}
          {showChat && chatAction ? (
            <button
              type="button"
              disabled={messaging || !chatPeerId || !chatReady}
              onClick={() => void handleMessage()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {messaging ? <Loader2 className="size-4 animate-spin" /> : <MessageSquare className="size-4" />}
              {chatAction}
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={labels.progress} value={`${item.progressPercent}%`} accent />
        <StatCard
          label="Buổi đã hoàn thành"
          value={`${item.completedSessions}/${item.totalSessions || '—'}`}
        />
        <StatCard label="Bắt đầu" value={item.startAt} compact />
        <StatCard label="Kết thúc" value={item.endAt} compact />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">{labels.sessionList}</h2>
          {item.sessionPerspective === 'mentor' && (
            <button
              type="button"
              onClick={() => setCreateSessionOpen(true)}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
            >
              + Thêm buổi học mới
            </button>
          )}
        </div>
        {item.sessionRows.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            {labels.sessionEmpty}
          </p>
        ) : (
          <DashboardTableCard>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] table-fixed text-left text-sm">
                <thead>
                  <tr className={dashboardTableHeadClass}>
                    <th className={dashboardTableHeadCell}>Buổi học</th>
                    <th className={cn(dashboardTableHeadCell, 'hidden md:table-cell')}>Bắt đầu</th>
                    <th className={cn(dashboardTableHeadCell, 'hidden md:table-cell')}>Kết thúc</th>
                    <th className={dashboardTableHeadCell}>Trạng thái</th>
                    <th className={dashboardTableHeadCell}>Báo cáo</th>
                    <th className={dashboardTableHeadCell}>Xem</th>
                    <th className={dashboardTableHeadCell}>Nộp báo cáo</th>
                    <th className={dashboardTableHeadCell}>Duyệt</th>
                    <th className={cn(dashboardTableHeadCell, 'text-right')}>Thao tác buổi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {item.sessionRows.map((row) => {
                    const sessionReport = findReportForSession(reportRequests, row.sessionId);
                    return (
                    <tr key={row.sessionId} className={dashboardTableRowClass}>
                      <td className={dashboardTableCellTruncate} title={row.title}>
                        <span className="font-medium">{row.title}</span>
                      </td>
                      <td className={cn(dashboardTableCell, 'hidden md:table-cell text-slate-600')}>{row.startAt}</td>
                      <td className={cn(dashboardTableCell, 'hidden md:table-cell text-slate-600')}>{row.endAt}</td>
                      <td className={dashboardTableCell}>
                        <span className="inline-flex whitespace-nowrap rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {row.status}
                        </span>
                      </td>
                      <SessionScheduleReportCells
                        bookingId={item.bookingId}
                        sessionId={row.sessionId}
                        report={sessionReport}
                        perspective={reportPerspective}
                      />
                      <td className={cn(dashboardTableCell, 'text-right')}>
                        <div className="flex flex-nowrap items-center justify-end gap-2">

                          {row.meetingUrl ? (
                            <a
                              href={row.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                            >
                              Vào phòng học
                            </a>
                          ) : null}
                          {item.sessionPerspective === 'mentor' &&
                          !['completed', 'canceled', 'cancelled', 'disputed'].includes(
                            row.rawStatus.toLowerCase(),
                          ) ? (
                            <button
                              type="button"
                              onClick={() => {
                                setScheduleSession(row);
                                if (row.scheduledAtIso) {
                                  const d = new Date(row.scheduledAtIso);
                                  const tzOffset = d.getTimezoneOffset() * 60000;
                                  const localTime = new Date(d.getTime() - tzOffset)
                                    .toISOString()
                                    .slice(0, 16);
                                  setScheduledAt(localTime);
                                } else {
                                  setScheduledAt('');
                                }
                                if (row.scheduledAtEndIso) {
                                  const d = new Date(row.scheduledAtEndIso);
                                  const tzOffset = d.getTimezoneOffset() * 60000;
                                  const localTime = new Date(d.getTime() - tzOffset)
                                    .toISOString()
                                    .slice(0, 16);
                                  setScheduledAtEnd(localTime);
                                } else {
                                  setScheduledAtEnd('');
                                }
                                setMeetingUrl(row.meetingUrl || '');
                                setSessionStatus(row.rawStatus.toLowerCase());
                                setScheduleOpen(true);
                              }}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Cập nhật
                            </button>
                          ) : null}

                          <SessionConfirmActions row={row} onUpdated={onRefresh} />
                          {showReview && row.status === 'Hoàn thành' ? (
                            <button
                              type="button"
                              onClick={() => {
                                setReviewBookingId(row.bookingId);
                                setRating(5);
                                setComment('');
                                setReviewOpen(true);
                              }}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Đánh giá
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {unattachedReports.length > 0 ? (
              <div className="border-t border-slate-100 px-4 py-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Báo cáo không gắn buổi cụ thể
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] table-fixed text-left text-sm">
                    <thead>
                      <tr className={dashboardTableHeadClass}>
                        <th className={dashboardTableHeadCell}>Tiêu đề</th>
                        <th className={dashboardTableHeadCell}>Trạng thái</th>
                        <th className={dashboardTableHeadCell}>Xem</th>
                        <th className={dashboardTableHeadCell}>Nộp báo cáo</th>
                        <th className={dashboardTableHeadCell}>Duyệt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {unattachedReports.map((req) => (
                        <tr key={req.id} className={dashboardTableRowClass}>
                          <td className={dashboardTableCellTruncate} title={req.title}>
                            {req.title}
                          </td>
                          <td className={dashboardTableCell}>
                            <span
                              className={cn(
                                'inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-2xs font-semibold',
                                SESSION_REPORT_STATUS_CLASS[req.status],
                              )}
                            >
                              {SESSION_REPORT_STATUS_LABEL[req.status]}
                            </span>
                          </td>
                          <td className={dashboardTableCell}>
                            <Link href={programSessionReportPath(item.bookingId, req.id)} className={dashboardTableActionLink}>
                              Xem
                            </Link>
                          </td>
                          <td className={dashboardTableCell}>
                            {reportPerspective === 'buyer' &&
                            (req.status === 'PENDING_SUBMISSION' || req.status === 'REJECTED') ? (
                              <Link
                                href={programSessionReportSubmitPath(item.bookingId, req.id)}
                                className="inline-flex whitespace-nowrap rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                              >
                                {req.status === 'REJECTED' ? 'Nộp lại' : 'Nộp báo cáo'}
                              </Link>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                          <td className={dashboardTableCell}>
                            {reportPerspective === 'mentor' && req.status === 'SUBMITTED' ? (
                              <Link
                                href={programSessionReportReviewPath(item.bookingId, req.id)}
                                className="inline-flex whitespace-nowrap rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                              >
                                Duyệt
                              </Link>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </DashboardTableCard>
        )}
      </section>

      {reviewOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setReviewOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">Đánh giá buổi học</h3>
            <label className="block text-sm font-semibold text-slate-700">Điểm đánh giá (*)</label>
            <div className="flex flex-col items-center gap-1 py-2">
              <div className="flex items-center gap-2.5">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = hoverRating !== null ? starValue <= hoverRating : starValue <= rating;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="transition-transform duration-100 active:scale-95 hover:scale-110 p-0.5"
                      aria-label={`${starValue} sao`}
                    >
                      <Star
                        className={cn(
                          'size-8 transition-colors duration-100',
                          isFilled ? 'fill-amber-400 text-amber-450' : 'text-slate-350'
                        )}
                        style={{
                          fill: isFilled ? '#fbbf24' : 'transparent', // Tailwind amber-400
                          stroke: isFilled ? '#fbbf24' : '#cbd5e1', // Tailwind slate-300
                        }}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-amber-500 h-4 mt-1">
                {rating === 1 && 'Rất tệ'}
                {rating === 2 && 'Không hài lòng'}
                {rating === 3 && 'Bình thường'}
                {rating === 4 && 'Hài lòng'}
                {rating === 5 && 'Tuyệt vời!'}
              </span>
            </div>
            <label className="block text-sm text-slate-600">Bình luận</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4 mt-1 h-24 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                onClick={() => setReviewOpen(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={submittingReview}
                onClick={async () => {
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
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {submittingReview ? 'Đang gửi…' : 'Gửi đánh giá'}
              </button>
            </div>
          </div>
        </div>
      ) : null}


      {/* Modal Xếp lịch */}
      {scheduleOpen && scheduleSession ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setScheduleOpen(false)} />
          <form
            onSubmit={(e) => void handleScheduleSave(e)}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="text-lg font-semibold text-slate-900">Cập nhật buổi học</h3>
            <p className="text-sm text-slate-500 font-medium">Buổi: {scheduleSession.title}</p>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày giờ bắt đầu (*)</label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày giờ kết thúc</label>
              <input
                type="datetime-local"
                value={scheduledAtEnd}
                onChange={(e) => setScheduledAtEnd(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Link phòng họp (Google Meet, Zoom...)</label>
              <input
                type="url"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái buổi học</label>
              <select
                value={sessionStatus}
                onChange={(e) => setSessionStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition bg-white"
              >
                <option value="pending">Chờ xếp lịch (Pending)</option>
                <option value="scheduled">Đã lên lịch (Scheduled)</option>
                <option value="in_progress">Đang diễn ra (In Progress)</option>
                <option value="awaiting_confirmation">Chờ xác nhận (Awaiting Confirmation)</option>
                <option value="completed">Hoàn thành (Completed)</option>
                <option value="canceled">Đã hủy (Canceled)</option>
                <option value="no_show">Vắng mặt (No Show)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                onClick={() => setScheduleOpen(false)}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={scheduling}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60 transition flex items-center gap-1.5"
              >
                {scheduling ? 'Đang lưu…' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Modal Thêm buổi học mới */}
      {createSessionOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCreateSessionOpen(false)} />
          <form
            onSubmit={(e) => void handleCreateSession(e)}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="text-lg font-semibold text-slate-900">Thêm buổi học mới</h3>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tiêu đề buổi học (*)</label>
              <input
                type="text"
                required
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                placeholder="Ví dụ: Hướng dẫn viết Proposal"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Mô tả nội dung</label>
              <textarea
                value={newSessionDescription}
                onChange={(e) => setNewSessionDescription(e.target.value)}
                placeholder="Mô tả tóm tắt nội dung sẽ trao đổi..."
                className="w-full h-24 resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                onClick={() => setCreateSessionOpen(false)}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={creatingSession}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60 transition flex items-center gap-1.5"
              >
                {creatingSession ? 'Đang tạo…' : 'Tạo buổi học'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Modal Cập nhật tiến trình */}
      {progressOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setProgressOpen(false)} />
          <form
            onSubmit={(e) => void handleUpdateProgress(e)}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="text-lg font-semibold text-slate-900">Cập nhật tiến trình gói dịch vụ</h3>
            <p className="text-xs text-slate-500">Cập nhật tiến trình hoàn thành của gói dịch vụ này cho học viên.</p>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tiến trình (%)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progressVal}
                  onChange={(e) => setProgressVal(Number(e.target.value))}
                  className="flex-1 accent-indigo-600"
                />
                <span className="w-12 text-right font-semibold text-indigo-600 text-sm">{progressVal}%</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                onClick={() => setProgressOpen(false)}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={updatingProgress}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60 transition flex items-center gap-1.5"
              >
                {updatingProgress ? 'Đang lưu…' : 'Lưu tiến trình'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  compact,
}: {
  label: string;
  value: string;
  accent?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p
        className={cn(
          'mt-1 font-semibold leading-snug text-slate-900',
          accent ? 'text-lg text-indigo-600' : compact ? 'text-base' : 'text-lg',
        )}
      >
        {value}
      </p>
    </div>
  );
}
