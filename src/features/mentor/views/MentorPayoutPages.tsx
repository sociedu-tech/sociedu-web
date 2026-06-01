'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useMentorFinanceSummary, useMentorPayouts } from '@/features/mentor/hooks/useMentorPayouts';
import { formatVnd } from '@/features/finance/lib/payoutUi';
import {
  PayoutBalanceHero,
  PayoutEmptyState,
  PayoutPageShell,
  PayoutPanel,
} from '@/features/finance/ui/PayoutPageLayout';
import { PayoutRequestsTable } from '@/features/finance/ui/PayoutRequestsTable';

export function MentorPayoutsListPage() {
  const { finance, loading: financeLoading, error: financeError } = useMentorFinanceSummary();
  const { items, loading: listLoading, error: listError, totalElements, refresh } = useMentorPayouts();

  if (financeLoading && listLoading) {
    return (
      <PayoutPageShell>
        <PageLoadingState label="Đang tải rút tiền…" variant="table" minHeight="min-h-[50vh]" />
      </PayoutPageShell>
    );
  }

  const error = financeError ?? listError;

  return (
    <PayoutPageShell>
      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:grid lg:grid-cols-[minmax(280px,360px)_1fr] lg:gap-8">
        {finance ? (
          <div className="shrink-0 lg:sticky lg:top-0 lg:self-start">
            <PayoutBalanceHero
              available={formatVnd(finance.walletBalance)}
              totalEarned={formatVnd(finance.totalRevenue)}
              totalWithdrawn={formatVnd(finance.totalWithdrawn)}
              locked={formatVnd(finance.lockedBalance)}
            />
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Số tiền tối thiểu mỗi lần rút: <strong className="text-slate-700">50.000đ</strong>.
              Yêu cầu sẽ được admin xử lý trong 1–3 ngày làm việc.
            </p>
          </div>
        ) : null}

        <PayoutPanel
          className="min-h-[min(520px,70vh)] lg:min-h-[calc(100dvh-12rem)]"
          title="Lịch sử yêu cầu"
          subtitle={`${totalElements} yêu cầu`}
          action={
            <div className="flex items-center gap-3">
              {!listLoading ? (
                <button
                  type="button"
                  onClick={() => void refresh()}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Làm mới
                </button>
              ) : null}
              <Link
                href="/dashboard/payouts/new"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
              >
                <Plus className="size-3.5" />
                Tạo yêu cầu
              </Link>
            </div>
          }
        >
          {error && !items.length ? (
            <div className="p-6">
              <ErrorMessage message={error} onRetry={refresh} />
            </div>
          ) : listLoading ? (
            <PageLoadingState label="Đang tải…" variant="table" minHeight="min-h-[280px]" />
          ) : items.length === 0 ? (
            <PayoutEmptyState
              icon={Wallet}
              title="Chưa có yêu cầu rút tiền"
              description="Tạo yêu cầu đầu tiên để chuyển số dư về tài khoản ngân hàng."
              action={
                <Link
                  href="/dashboard/payouts/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  <Plus className="size-4" />
                  Tạo yêu cầu
                </Link>
              }
            />
          ) : (
            <PayoutRequestsTable items={items} variant="mentor" />
          )}
        </PayoutPanel>
      </div>
    </PayoutPageShell>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15';

export function MentorPayoutCreatePage() {
  const router = useRouter();
  const { finance, loading, error } = useMentorFinanceSummary();
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const value = Number(amount.replace(/\D/g, ''));
    if (!value || value < 50000) {
      setFormError('Số tiền tối thiểu là 50.000đ.');
      return;
    }
    if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) {
      setFormError('Vui lòng điền đầy đủ thông tin ngân hàng.');
      return;
    }
    if (finance && value > finance.walletBalance) {
      setFormError('Số tiền vượt quá số dư khả dụng.');
      return;
    }
    setSubmitting(true);
    try {
      const { payoutService } = await import('@/services/payoutService');
      const created = await payoutService.createPayout({
        amount: value,
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim(),
      });
      router.push(`/dashboard/payouts/${created.id}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Không gửi được yêu cầu.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PayoutPageShell backHref="/dashboard/payouts">
        <PageLoadingState label="Đang tải…" />
      </PayoutPageShell>
    );
  }

  if (error) {
    return (
      <PayoutPageShell backHref="/dashboard/payouts">
        <ErrorMessage message={error} />
      </PayoutPageShell>
    );
  }

  return (
    <PayoutPageShell backHref="/dashboard/payouts">
      <div className="grid min-h-0 flex-1 gap-8 lg:grid-cols-[1fr_minmax(280px,380px)]">
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <h2 className="text-base font-semibold text-slate-900">Thông tin chuyển khoản</h2>
            <p className="mt-1 text-sm text-slate-500">Kiểm tra kỹ số tài khoản trước khi gửi.</p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Số tiền rút (VND)</span>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500000"
              className={inputClass}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Ngân hàng</span>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Vietcombank"
              className={inputClass}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Số tài khoản</span>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Chủ tài khoản</span>
            <input
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              className={inputClass}
            />
          </label>

          {formError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
          ) : null}

          <div className="mt-auto flex flex-wrap gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
            >
              {submitting ? 'Đang gửi…' : 'Gửi yêu cầu'}
            </button>
          </div>
        </form>

        {finance ? (
          <aside className="space-y-4 lg:sticky lg:top-0 lg:self-start">
            <PayoutBalanceHero
              available={formatVnd(finance.walletBalance)}
              totalEarned={formatVnd(finance.totalRevenue)}
              totalWithdrawn={formatVnd(finance.totalWithdrawn)}
              locked={formatVnd(finance.lockedBalance)}
            />
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
              <p className="font-semibold text-slate-900">Lưu ý</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-relaxed">
                <li>Phí nền tảng ~10% được trừ vào số thực nhận.</li>
                <li>Tên chủ TK phải khớp với tài khoản ngân hàng.</li>
                <li>Không thể hủy yêu cầu sau khi admin duyệt.</li>
              </ul>
            </div>
          </aside>
        ) : null}
      </div>
    </PayoutPageShell>
  );
}
