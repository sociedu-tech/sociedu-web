 'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { bookingService } from '@/services/bookingService';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import type { DashboardSessionRow } from '@/features/dashboard/types/booking';

type Props = {
  row: DashboardSessionRow;
  onUpdated: () => void;
};

export function SessionConfirmActions({ row, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (row.rawStatus.toLowerCase() === 'disputed') {
    return (
      <div className="flex flex-col items-start gap-2">
        <span className="text-xs font-medium text-amber-700">Tranh chấp — dùng báo cáo kiểm duyệt</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard?reportSessionId=${encodeURIComponent(row.sessionId)}`)}
          >
            Báo cáo tranh chấp
          </Button>
        </div>
      </div>
    );
  }

  if (row.myAck === true) {
    return <span className="text-xs font-medium text-emerald-700">Bạn đã xác nhận hoàn thành</span>;
  }

  if (row.myAck === false) {
    return <span className="text-xs font-medium text-rose-700">Bạn đã từ chối hoàn thành</span>;
  }

  if (!row.canConfirm) {
    if (row.rawStatus.toLowerCase() === 'completed') {
      return <span className="text-xs text-slate-500">Đã hoàn thành</span>;
    }
    if (row.scheduledAtIso && Date.now() < Date.parse(row.scheduledAtIso)) {
      return <span className="text-xs text-slate-500">Chưa đến hạn buổi học</span>;
    }
    if (row.menteeCompletionAck === true || row.mentorCompletionAck === true) {
      return <span className="text-xs text-slate-500">Chờ phía còn lại xác nhận</span>;
    }
    return null;
  }

  const submit = async (completed: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await bookingService.confirmSessionCompletion(row.bookingId, row.sessionId, { completed });
      onUpdated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không gửi được xác nhận.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => submit(true)}
          className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : 'Hoàn thành'}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => submit(false)}
          className="rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
        >
          Không hoàn thành
        </button>
      </div>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </div>
  );
}
