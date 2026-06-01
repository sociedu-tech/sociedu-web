'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useAdminPayoutDetail, useAdminPayouts } from '@/features/admin/hooks/useAdminPayouts';
import { adminPayoutService } from '@/services/adminPayoutService';
import { formatVnd, PayoutStatusBadge } from '@/features/finance/lib/payoutUi';
import { formatViDateTime } from '@/lib/apiUtils';
import { cn } from '@/lib/utils';
import {
  PayoutDetailField,
  PayoutDetailGrid,
  PayoutEmptyState,
  PayoutPageShell,
  PayoutPanel,
} from '@/features/finance/ui/PayoutPageLayout';
import { PayoutRequestsTable } from '@/features/finance/ui/PayoutRequestsTable';

const STATUS_TABS = [
  { value: '', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'PAID', label: 'Đã chuyển' },
  { value: 'REJECTED', label: 'Từ chối' },
];

export function AdminPayoutsListPage() {
  const [status, setStatus] = useState('');
  const { items, totalElements, loading, error, refresh } = useAdminPayouts(status || undefined);

  return (
    <PayoutPageShell>
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value || 'all'}
              type="button"
              onClick={() => setStatus(tab.value)}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-semibold transition',
                status === tab.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <PayoutPanel
          className="min-h-[min(560px,75vh)] lg:min-h-[calc(100dvh-11rem)]"
          title="Danh sách yêu cầu"
          subtitle={`${totalElements} yêu cầu${status ? ` · ${STATUS_TABS.find((t) => t.value === status)?.label}` : ''}`}
          action={
            !loading ? (
              <button
                type="button"
                onClick={() => void refresh()}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Làm mới
              </button>
            ) : null
          }
        >
          {loading ? (
            <PageLoadingState label="Đang tải…" variant="table" minHeight="min-h-[320px]" />
          ) : error ? (
            <div className="p-6">
              <ErrorMessage message={error} onRetry={refresh} />
            </div>
          ) : items.length === 0 ? (
            <PayoutEmptyState
              icon={Wallet}
              title="Không có yêu cầu"
              description="Chưa có yêu cầu rút tiền nào trong bộ lọc này."
            />
          ) : (
            <PayoutRequestsTable items={items} variant="admin" />
          )}
        </PayoutPanel>
      </div>
    </PayoutPageShell>
  );
}

export function AdminPayoutDetailPage() {
  const params = useParams();
  const payoutId = String(params?.payoutId ?? '');
  const { item, loading, error, refresh } = useAdminPayoutDetail(payoutId);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const runAction = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setActionError(null);
    try {
      await fn();
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Thao tác thất bại.');
    } finally {
      setBusy(false);
    }
  };

  if (!payoutId) {
    return (
      <PayoutPageShell backHref="/dashboard/payouts">
        <ErrorMessage message="Thiếu mã yêu cầu." />
      </PayoutPageShell>
    );
  }

  if (loading && !item) {
    return (
      <PayoutPageShell backHref="/dashboard/payouts">
        <PageLoadingState label="Đang tải…" />
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
        <ErrorMessage message="Không tìm thấy yêu cầu." />
      </PayoutPageShell>
    );
  }

  const status = String(item.status ?? '').toUpperCase();
  const canAct = status === 'PENDING' || status === 'APPROVED';

  return (
    <PayoutPageShell backHref="/dashboard/payouts" action={<PayoutStatusBadge status={item.status} />}>
      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
        <PayoutPanel
          title={formatVnd(item.grossAmount)}
          subtitle={`Mã · ${item.id}`}
          className="min-h-[400px]"
        >
          <div className="p-5 sm:p-6">
            <PayoutDetailGrid>
              <PayoutDetailField label="Mentor ID" value={item.mentorId ?? '—'} />
              <PayoutDetailField label="Số tiền rút" value={formatVnd(item.grossAmount)} />
              <PayoutDetailField label="Thực nhận" value={formatVnd(item.netAmount)} />
              <PayoutDetailField label="Ngân hàng" value={item.bankName ?? '—'} />
              <PayoutDetailField label="Số tài khoản" value={item.accountNumber ?? '—'} />
              <PayoutDetailField label="Chủ TK" value={item.accountHolder ?? '—'} />
              <PayoutDetailField label="Tạo lúc" value={formatViDateTime(item.createdAt)} />
              {item.processedAt ? (
                <PayoutDetailField label="Xử lý lúc" value={formatViDateTime(item.processedAt)} />
              ) : null}
            </PayoutDetailGrid>
          </div>
        </PayoutPanel>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái hiện tại</p>
            <div className="mt-3">
              <PayoutStatusBadge status={item.status} />
            </div>
          </div>

          {canAct ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Xử lý yêu cầu</h3>
              <label className="mt-4 block space-y-2">
                <span className="text-xs font-medium text-slate-600">Ghi chú / mã giao dịch</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                  placeholder="Mã chuyển khoản hoặc lý do từ chối"
                />
              </label>
              {actionError ? (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{actionError}</p>
              ) : null}
              <div className="mt-4 flex flex-col gap-2">
                {status === 'PENDING' ? (
                  <>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction(() => adminPayoutService.approve(payoutId))}
                      className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Duyệt yêu cầu
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void runAction(() => adminPayoutService.reject(payoutId, note || 'Từ chối bởi admin'))
                      }
                      className="w-full rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-60"
                    >
                      Từ chối
                    </button>
                  </>
                ) : null}
                {status === 'APPROVED' ? (
                  <>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void runAction(() => adminPayoutService.markPaid(payoutId, note || 'PAID'))
                      }
                      className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Đánh dấu đã chuyển
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void runAction(() => adminPayoutService.markFailed(payoutId, note || 'Chuyển khoản thất bại'))
                      }
                      className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-60"
                    >
                      Đánh dấu thất bại
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </PayoutPageShell>
  );
}
