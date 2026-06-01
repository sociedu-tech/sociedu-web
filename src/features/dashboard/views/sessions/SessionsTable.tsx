 'use client';

import { Video, Edit, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import {
  DashboardTableCard,
  dashboardTableHeadClass,
  dashboardTableHeadCell,
  dashboardTableCell,
  dashboardTableCellTruncate,
  dashboardTableRowClass,
} from '@/features/dashboard/ui/DashboardTable';
import { DataPagination } from '@/components/ui/DataPagination';
import { SessionConfirmActions } from '@/features/dashboard/views/sessions/SessionConfirmActions';
import type { DashboardSessionRow } from '@/features/dashboard/types/booking';
import { useState } from 'react';
import { reviewService } from '@/services/reviewService';
import { bookingService } from '@/services/bookingService';
import { useToast } from '@/context/ToastContext';

type Props = {
  counterpartyHeader: string;
  rows: DashboardSessionRow[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  page: number;
  size: number;
  total: number;
  totalPages: number;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  role?: 'buyer' | 'mentor';
};

export function SessionsTable({
  counterpartyHeader,
  rows,
  loading,
  error,
  refresh,
  page,
  size,
  total,
  totalPages,
  setPage,
  setSize,
  role,
}: Props) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const toast = useToast();
  const handleUpdateMeetingUrl = async (bookingId: string, sessionId: string, currentUrl: string | null) => {
    const newUrl = window.prompt('Nhập link phòng học mới (Google Meet, Zoom, ...):', currentUrl || '');
    if (newUrl === null) return;
    try {
      await bookingService.updateSession(bookingId, sessionId, { meetingUrl: newUrl.trim() });
      toast.success('Cập nhật link phòng học thành công.');
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không cập nhật được link.');
    }
  };
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  if (loading && rows.length === 0) {
    return <PageLoadingState label="Đang tải buổi học…" variant="table" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="space-y-4">
      <DashboardTableCard>
        <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className={dashboardTableHeadClass}>
              <th className={dashboardTableHeadCell}>Buổi học</th>
              <th className={cn(dashboardTableHeadCell, 'hidden sm:table-cell')}>Thời gian</th>
              <th className={cn(dashboardTableHeadCell, 'hidden md:table-cell')}>{counterpartyHeader}</th>
              <th className={dashboardTableHeadCell}>Trạng thái</th>
              <th className={dashboardTableHeadCell}>Phòng học</th>
              <th className={cn(dashboardTableHeadCell, 'min-w-[180px]')}>Xác nhận</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {rows.map((row) => (
              <tr key={`${row.bookingId}-${row.sessionId}`} className={dashboardTableRowClass}>
                <td className={dashboardTableCellTruncate} title={row.title}>
                  <span className="font-medium">{row.title}</span>
                </td>
                <td className={cn(dashboardTableCell, 'hidden text-slate-600 sm:table-cell')}>{row.when}</td>
                <td className={cn(dashboardTableCellTruncate, 'hidden md:table-cell text-slate-600')} title={row.counterparty}>
                  {row.counterparty}
                </td>
                <td className={dashboardTableCell}>
                  <span className="badge-primary whitespace-nowrap">{row.status}</span>
                </td>
                <td className={dashboardTableCell}>
                  <div className="flex items-center gap-1.5">
                    {row.meetingUrl ? (
                      <a
                        href={row.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors"
                      >
                        <span>Vào phòng</span>
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Chưa có link</span>
                    )}
                    {role === 'mentor' && (
                      <button
                        type="button"
                        onClick={() => void handleUpdateMeetingUrl(row.bookingId, row.sessionId, row.meetingUrl || '')}
                        className="inline-flex size-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors"
                        title="Cập nhật link phòng học"
                      >
                        <Edit className="size-3.5" />
                      </button>
                    )}
                  </div>
                </td>
                <td className={dashboardTableCell}>
                  <div className="flex flex-nowrap items-center gap-2">
                    <SessionConfirmActions row={row} onUpdated={refresh} />
                    {role === 'buyer' && row.status === 'Hoàn thành' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBooking(row.bookingId);
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
      </DashboardTableCard>
      {rows.length === 0 && !loading && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-10 text-center text-slate-500 shadow-sm">
          <Video className="size-10 text-slate-300" strokeWidth={1.5} />
          <p>Chưa có buổi học nào.</p>
        </div>
      )}
      <DataPagination
        page={page}
        size={size}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onSizeChange={setSize}
        disabled={loading}
      />
      {reviewOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setReviewOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-3 text-lg font-semibold">Đánh giá buổi học</h3>
            <label className="block text-sm">Điểm (1-5)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mb-3 w-full rounded border px-2 py-1"
            />
            <label className="block text-sm">Bình luận</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-3 h-24 w-full rounded border px-2 py-1"
            />
            <div className="flex justify-end gap-2">
              <button type="button" className="rounded px-3 py-1" onClick={() => setReviewOpen(false)}>
                Hủy
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!selectedBooking) return;
                  setSubmittingReview(true);
                  try {
                    await reviewService.createReview(selectedBooking, { rating, comment });
                    setReviewOpen(false);
                    setSelectedBooking(null);
                    refresh();
                  } catch {
                    // ignore
                  } finally {
                    setSubmittingReview(false);
                  }
                }}
                disabled={submittingReview}
                className="rounded bg-primary px-3 py-1 text-white"
              >
                {submittingReview ? 'Đang gửi…' : 'Gửi đánh giá'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
