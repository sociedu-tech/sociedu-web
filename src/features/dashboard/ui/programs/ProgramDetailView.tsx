'use client';

import Link from 'next/link';
import { Flag, Loader2, MessageSquare, ShoppingBag, User } from 'lucide-react';
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
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { DashboardTableCard, dashboardTableHeadClass } from '@/features/dashboard/ui/DashboardTable';
import { reviewService } from '@/services/reviewService';
import { pickPackageLabel } from '@/lib/resolveOrderPackageNames';
import { bookingService } from '@/services/bookingService';

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
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // States for Scheduling (Xếp lịch)
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleSession, setScheduleSession] = useState<DashboardSessionRow | null>(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [scheduling, setScheduling] = useState(false);

  // States for Custom Session Creation (Thêm buổi học mới)
  const [createSessionOpen, setCreateSessionOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionDescription, setNewSessionDescription] = useState('');
  const [creatingSession, setCreatingSession] = useState(false);

  const handleScheduleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleSession) return;
    if (!scheduledAt) {
      toast.error('Vui lòng chọn ngày giờ học.');
      return;
    }
    setScheduling(true);
    try {
      const isoScheduledAt = new Date(scheduledAt).toISOString();
      await bookingService.updateSession(item.bookingId, scheduleSession.sessionId, {
        scheduledAt: isoScheduledAt,
        meetingUrl: meetingUrl.trim() || undefined,
      });
      toast.success('Xếp lịch buổi học thành công.');
      setScheduleOpen(false);
      setScheduleSession(null);
      setScheduledAt('');
      setMeetingUrl('');
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không xếp được lịch học.');
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
            <label className="block text-sm text-slate-600">Điểm (1–5)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mb-3 mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày giờ học (*)</label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
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
