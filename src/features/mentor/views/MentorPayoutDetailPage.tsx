'use client';

import { useParams } from 'next/navigation';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useMentorPayoutDetail } from '@/features/mentor/hooks/useMentorPayouts';
import { formatVnd, PayoutStatusBadge } from '@/features/finance/lib/payoutUi';
import { formatViDateTime } from '@/lib/apiUtils';
import {
  PayoutDetailField,
  PayoutDetailGrid,
  PayoutPageShell,
  PayoutPanel,
} from '@/features/finance/ui/PayoutPageLayout';

export function MentorPayoutDetailPage() {
  const params = useParams();
  const payoutId = String(params?.payoutId ?? '');
  const { item, loading, error, refresh } = useMentorPayoutDetail(payoutId);

  if (!payoutId) {
    return (
      <PayoutPageShell backHref="/dashboard/payouts">
        <ErrorMessage message="Không xác định được yêu cầu rút tiền." />
      </PayoutPageShell>
    );
  }

  if (loading && !item) {
    return (
      <PayoutPageShell backHref="/dashboard/payouts">
        <PageLoadingState label="Đang tải chi tiết…" />
      </PayoutPageShell>
    );
  }

  if (error && !item) {
    return (
      <PayoutPageShell backHref="/dashboard/payouts">
        <ErrorMessage message={error} onRetry={refresh} />
      </PayoutPageShell>
    );
  }

  if (!item) {
    return (
      <PayoutPageShell backHref="/dashboard/payouts">
        <ErrorMessage message="Không tìm thấy yêu cầu rút tiền." onRetry={refresh} />
      </PayoutPageShell>
    );
  }

  return (
    <PayoutPageShell backHref="/dashboard/payouts" action={<PayoutStatusBadge status={item.status} />}>
      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
        <PayoutPanel title={formatVnd(item.grossAmount)} subtitle={`Mã yêu cầu · ${item.id}`} className="min-h-[400px]">
          <div className="p-5 sm:p-6">
            <PayoutDetailGrid>
              <PayoutDetailField label="Số tiền rút" value={formatVnd(item.grossAmount)} />
              <PayoutDetailField label="Thực nhận (sau phí)" value={formatVnd(item.netAmount)} />
              <PayoutDetailField label="Ngân hàng" value={item.bankName ?? '—'} />
              <PayoutDetailField label="Số tài khoản" value={item.accountNumber ?? '—'} />
              <PayoutDetailField label="Chủ tài khoản" value={item.accountHolder ?? '—'} />
              <PayoutDetailField label="Tạo lúc" value={formatViDateTime(item.createdAt)} />
              {item.processedAt ? (
                <PayoutDetailField label="Xử lý lúc" value={formatViDateTime(item.processedAt)} />
              ) : null}
              {item.transactionReference ? (
                <PayoutDetailField label="Mã giao dịch" value={item.transactionReference} className="sm:col-span-2" />
              ) : null}
            </PayoutDetailGrid>

            {item.rejectReason ? (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p className="font-semibold">Lý do từ chối</p>
                <p className="mt-1">{item.rejectReason}</p>
              </div>
            ) : null}
            {item.failureReason ? (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <p className="font-semibold">Lý do thất bại</p>
                <p className="mt-1">{item.failureReason}</p>
              </div>
            ) : null}
          </div>
        </PayoutPanel>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</p>
            <div className="mt-3">
              <PayoutStatusBadge status={item.status} />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Theo dõi tiến trình xử lý yêu cầu. Admin sẽ chuyển khoản sau khi duyệt.
            </p>
          </div>
        </aside>
      </div>
    </PayoutPageShell>
  );
}
