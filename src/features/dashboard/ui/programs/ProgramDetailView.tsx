'use client';

import Link from 'next/link';
import { Flag, Loader2, MessageSquare, ShoppingBag, User, FileText, CheckCircle2, XCircle, Plus, AlertCircle, Calendar, ExternalLink, Star } from 'lucide-react';
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
import { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { DashboardTableCard, dashboardTableHeadClass } from '@/features/dashboard/ui/DashboardTable';
import { reviewService } from '@/services/reviewService';
import { pickPackageLabel } from '@/lib/resolveOrderPackageNames';
import { bookingService } from '@/services/bookingService';
import { sessionReportService, type SessionReportRequest } from '@/services/sessionReportService';

type Props = {
  item: BookingProgramItem;
  order: ServiceOrderDto | null;
  onRefresh: () => void;
  labels: ProgramLabels;
  showChat?: boolean;
  showReview?: boolean;
  showReport?: boolean;
};

export function ProgramDetailView({
  item,
  order,
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

  // States for Session Report Requests
  const [reportRequests, setReportRequests] = useState<SessionReportRequest[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  // Modal Create Report Request
  const [createReqOpen, setCreateReqOpen] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDescription, setReqDescription] = useState('');
  const [reqDueDate, setReqDueDate] = useState('');
  const [reqSessionId, setReqSessionId] = useState('');
  const [creatingReq, setCreatingReq] = useState(false);

  // Modal Submit Report (Mentee)
  const [submitReportOpen, setSubmitReportOpen] = useState(false);
  const [activeReqId, setActiveReqId] = useState<string | null>(null);
  const [reportContent, setReportContent] = useState('');
  const [reportAttachment, setReportAttachment] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  // Modal Review Report (Mentor)
  const [reviewReportOpen, setReviewReportOpen] = useState(false);
  const [reviewReq, setReviewReq] = useState<SessionReportRequest | null>(null);
  const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewingReport, setReviewingReport] = useState(false);
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
      });
      toast.success('Xếp lịch buổi học thành công.');
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

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const res = await sessionReportService.listForBooking(item.bookingId);
      setReportRequests(res);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [item]);

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

  const handleCreateReportRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề yêu cầu.');
      return;
    }
    setCreatingReq(true);
    try {
      const isoDueDate = reqDueDate ? new Date(reqDueDate).toISOString() : undefined;
      await sessionReportService.createRequest(item.bookingId, {
        title: reqTitle.trim(),
        description: reqDescription.trim() || undefined,
        dueDate: isoDueDate,
        sessionId: reqSessionId || undefined,
      });
      toast.success('Tạo yêu cầu báo cáo thành công.');
      setCreateReqOpen(false);
      setReqTitle('');
      setReqDescription('');
      setReqDueDate('');
      setReqSessionId('');
      fetchReports();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không tạo được yêu cầu.');
    } finally {
      setCreatingReq(false);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReqId) return;
    if (!reportContent.trim()) {
      toast.error('Vui lòng nhập nội dung báo cáo.');
      return;
    }
    if (reportAttachment && !reportAttachment.startsWith('http://') && !reportAttachment.startsWith('https://')) {
      toast.error('Link tài liệu đính kèm phải là URL hợp lệ (bắt đầu bằng http:// hoặc https://).');
      return;
    }
    setSubmittingReport(true);
    try {
      await sessionReportService.submit(activeReqId, {
        content: reportContent.trim(),
        attachmentUrl: reportAttachment.trim() || undefined,
      });
      toast.success('Nộp báo cáo thành công.');
      setSubmitReportOpen(false);
      setActiveReqId(null);
      setReportContent('');
      setReportAttachment('');
      fetchReports();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không nộp được báo cáo.');
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleReviewReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewReq) return;
    setReviewingReport(true);
    try {
      await sessionReportService.review(reviewReq.id, {
        status: reviewStatus,
        feedback: reviewFeedback.trim() || undefined,
      });
      toast.success('Duyệt báo cáo thành công.');
      setReviewReportOpen(false);
      setReviewReq(null);
      setReviewFeedback('');
      fetchReports();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không duyệt được báo cáo.');
    } finally {
      setReviewingReport(false);
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
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            {labels.detailEyebrow}
          </p>
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
              Báo cáo
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
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className={dashboardTableHeadClass}>
                    <th className="px-4 py-3">Buổi học</th>
                    <th className="hidden px-4 py-3 md:table-cell">Bắt đầu</th>
                    <th className="hidden px-4 py-3 md:table-cell">Kết thúc</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {item.sessionRows.map((row) => (
                    <tr key={row.sessionId} className="bg-white hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-medium">{row.title}</td>
                      <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{row.startAt}</td>
                      <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{row.endAt}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">

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
                                setScheduleOpen(true);
                              }}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Xếp lịch
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
                  ))}
                </tbody>
              </table>
            </div>
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
            <h3 className="text-lg font-semibold text-slate-900">Lên lịch buổi học</h3>
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
                {scheduling ? 'Đang lưu…' : 'Lưu lịch'}
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

      {/* Yêu cầu báo cáo buổi học */}
      <section className="space-y-4 pt-6 border-t border-slate-200/85">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Báo cáo buổi học</h2>
            <p className="text-xs text-slate-500">Danh sách các yêu cầu nộp báo cáo và tiến trình duyệt</p>
          </div>
          {item.sessionPerspective === 'mentor' && (
            <button
              type="button"
              onClick={() => setCreateReqOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
            >
              <Plus className="size-3.5" />
              Tạo yêu cầu báo cáo
            </button>
          )}
        </div>

        {loadingReports ? (
          <div className="flex justify-center py-6">
            <Loader2 className="size-6 animate-spin text-slate-400" />
          </div>
        ) : reportRequests.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
            Chưa có yêu cầu báo cáo nào cho chương trình học này.
          </p>
        ) : (
          <div className="grid gap-3">
            {reportRequests.map((req) => {
              const statusColors = {
                PENDING_SUBMISSION: 'bg-amber-50 text-amber-850 border-amber-205',
                SUBMITTED: 'bg-blue-50 text-blue-855 border-blue-205',
                APPROVED: 'bg-emerald-50 text-emerald-855 border-emerald-205',
                REJECTED: 'bg-rose-50 text-rose-855 border-rose-205',
              };

              const statusTexts = {
                PENDING_SUBMISSION: 'Chờ nộp báo cáo',
                SUBMITTED: 'Đã nộp - Chờ duyệt',
                APPROVED: 'Đã thông qua',
                REJECTED: 'Cần sửa đổi (Từ chối)',
              };

              const associatedSession = item.sessionRows.find((s) => s.sessionId === req.sessionId);

              return (
                <div
                  key={req.id}
                  className="group relative flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-100 hover:shadow-md md:flex-row md:items-center"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-sm text-slate-900">{req.title}</h4>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-2xs font-semibold',
                          statusColors[req.status],
                        )}
                      >
                        {statusTexts[req.status]}
                      </span>
                      {associatedSession && (
                        <span className="inline-flex items-center rounded-full bg-slate-50 border border-slate-100 px-2 py-0.5 text-2xs font-medium text-slate-600">
                          Buổi: {associatedSession.title}
                        </span>
                      )}
                    </div>
                    {req.description && (
                      <p className="text-xs text-slate-600 line-clamp-2">{req.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-2xs text-slate-500 font-medium">
                      {req.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3 text-slate-400" />
                          Hạn nộp: {new Date(req.dueDate).toLocaleString('vi-VN')}
                        </span>
                      )}
                      <span>Yêu cầu lúc: {new Date(req.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                    
                    {/* Báo cáo đã nộp / Phản hồi của Mentor */}
                    {(req.menteeContent || req.mentorFeedback) && (
                      <div className="mt-3 rounded-lg bg-slate-50 p-3 space-y-2 border border-slate-100">
                        {req.menteeContent && (
                          <div className="text-xs">
                            <span className="font-semibold text-slate-700">Học viên nộp:</span>{' '}
                            <span className="text-slate-600 whitespace-pre-wrap">{req.menteeContent}</span>
                            {req.menteeAttachmentUrl && (
                              <div className="mt-1">
                                <a
                                  href={req.menteeAttachmentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-2xs font-bold text-indigo-600 hover:text-indigo-800"
                                >
                                  <ExternalLink className="size-3" />
                                  Tài liệu đính kèm (Drive)
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                        {req.mentorFeedback && (
                          <div className="text-xs border-t border-slate-200/60 pt-2">
                            <span className="font-semibold text-slate-700">Mentor phản hồi:</span>{' '}
                            <span className="text-slate-600 whitespace-pre-wrap">{req.mentorFeedback}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {/* Action buttons */}
                    {item.sessionPerspective === 'mentor' && req.status === 'SUBMITTED' && (
                      <button
                        type="button"
                        onClick={() => {
                          setReviewReq(req);
                          setReviewStatus('APPROVED');
                          setReviewFeedback(req.mentorFeedback || '');
                          setReviewReportOpen(true);
                        }}
                        className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
                      >
                        Xem &amp; Duyệt
                      </button>
                    )}

                    {item.sessionPerspective === 'buyer' && req.status === 'PENDING_SUBMISSION' && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveReqId(req.id);
                          setReportContent('');
                          setReportAttachment('');
                          setSubmitReportOpen(true);
                        }}
                        className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
                      >
                        Nộp báo cáo
                      </button>
                    )}

                    {item.sessionPerspective === 'buyer' && req.status === 'REJECTED' && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveReqId(req.id);
                          setReportContent(req.menteeContent || '');
                          setReportAttachment(req.menteeAttachmentUrl || '');
                          setSubmitReportOpen(true);
                        }}
                        className="rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition shadow-sm"
                      >
                        Nộp lại báo cáo
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

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

      {/* Modal Tạo yêu cầu báo cáo */}
      {createReqOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCreateReqOpen(false)} />
          <form
            onSubmit={(e) => void handleCreateReportRequest(e)}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="text-lg font-semibold text-slate-900">Yêu cầu nộp báo cáo</h3>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tiêu đề yêu cầu (*)</label>
              <input
                type="text"
                required
                value={reqTitle}
                onChange={(e) => setReqTitle(e.target.value)}
                placeholder="Ví dụ: Báo cáo kết quả buổi 1"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Mô tả chi tiết</label>
              <textarea
                value={reqDescription}
                onChange={(e) => setReqDescription(e.target.value)}
                placeholder="Nêu rõ nội dung, các mục học viên cần viết báo cáo..."
                className="w-full h-24 resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Chọn buổi học liên quan (tùy chọn)</label>
              <select
                value={reqSessionId}
                onChange={(e) => setReqSessionId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition bg-white"
              >
                <option value="">-- Không liên quan buổi nào --</option>
                {item.sessionRows.map((s) => (
                  <option key={s.sessionId} value={s.sessionId}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Hạn nộp</label>
              <input
                type="datetime-local"
                value={reqDueDate}
                onChange={(e) => setReqDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                onClick={() => setCreateReqOpen(false)}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={creatingReq}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60 transition"
              >
                {creatingReq ? 'Đang tạo…' : 'Gửi yêu cầu'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Modal Nộp báo cáo */}
      {submitReportOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSubmitReportOpen(false)} />
          <form
            onSubmit={(e) => void handleSubmitReport(e)}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="text-lg font-semibold text-slate-900">Nộp báo cáo học tập</h3>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nội dung báo cáo (*)</label>
              <textarea
                required
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                placeholder="Nhập nội dung tóm tắt buổi học, kết quả đạt được, khó khăn..."
                className="w-full h-32 resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Link đính kèm tài liệu (Google Drive, Github, v.v.)</label>
              <input
                type="url"
                value={reportAttachment}
                onChange={(e) => setReportAttachment(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                onClick={() => setSubmitReportOpen(false)}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submittingReport}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60 transition"
              >
                {submittingReport ? 'Đang nộp…' : 'Nộp báo cáo'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Modal Duyệt báo cáo */}
      {reviewReportOpen && reviewReq ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setReviewReportOpen(false)} />
          <form
            onSubmit={(e) => void handleReviewReport(e)}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="text-lg font-semibold text-slate-900">Xem &amp; Duyệt báo cáo</h3>
            
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-150 space-y-3">
               <div>
                 <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Yêu cầu</span>
                 <span className="text-sm font-semibold text-slate-800">{reviewReq.title}</span>
               </div>
               <div>
                 <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Nội dung học viên nộp</span>
                 <p className="text-xs text-slate-700 whitespace-pre-wrap font-medium">{reviewReq.menteeContent}</p>
               </div>
               {reviewReq.menteeAttachmentUrl && (
                 <div>
                   <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Tài liệu đính kèm</span>
                   <a
                     href={reviewReq.menteeAttachmentUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-0.5"
                   >
                     <ExternalLink className="size-3.5" />
                     Mở link tài liệu đính kèm (Drive)
                   </a>
                 </div>
               )}
             </div>

             <div className="space-y-2">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Đánh giá / Phán quyết</label>
               <div className="grid grid-cols-2 gap-2">
                 <button
                   type="button"
                   onClick={() => setReviewStatus('APPROVED')}
                   className={cn(
                     'rounded-xl py-2.5 text-xs font-bold border transition flex items-center justify-center gap-1.5',
                     reviewStatus === 'APPROVED'
                       ? 'bg-emerald-50 border-emerald-200 text-emerald-850 ring-2 ring-emerald-100'
                       : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600',
                   )}
                 >
                   <CheckCircle2 className="size-4" />
                   Đồng ý (Thông qua)
                 </button>
                 <button
                   type="button"
                   onClick={() => setReviewStatus('REJECTED')}
                   className={cn(
                     'rounded-xl py-2.5 text-xs font-bold border transition flex items-center justify-center gap-1.5',
                     reviewStatus === 'REJECTED'
                       ? 'bg-rose-50 border-rose-205 text-rose-850 ring-2 ring-rose-100'
                       : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600',
                   )}
                 >
                   <XCircle className="size-4" />
                   Từ chối (Cần chỉnh sửa)
                 </button>
               </div>
             </div>

             <div className="space-y-1">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Gợi ý / Nhận xét / Lý do từ chối</label>
               <textarea
                 value={reviewFeedback}
                 onChange={(e) => setReviewFeedback(e.target.value)}
                 placeholder="Nhận xét của bạn về báo cáo này để học viên biết..."
                 className="w-full h-24 resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
               />
             </div>

             <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
               <button
                 type="button"
                 className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                 onClick={() => setReviewReportOpen(false)}
               >
                 Hủy
               </button>
               <button
                 type="submit"
                 disabled={reviewingReport}
                 className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60 transition"
               >
                 {reviewingReport ? 'Đang gửi…' : 'Lưu phán quyết'}
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
