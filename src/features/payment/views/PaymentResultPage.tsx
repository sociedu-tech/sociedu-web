'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { usePaymentResultStatus } from '@/features/payment/hooks/usePaymentResultStatus';
import { useAuth } from '@/context/AuthContext';
import { shortOrderId, userOrderDetailPath } from '@/features/dashboard/lib/orderLabels';
import { MENTORING_PATH } from '@/features/dashboard/lib/programLabels';
import { cn } from '@/lib/utils';

type ResultTone = 'success' | 'failed' | 'pending';

function resolveTone(paid: boolean, failed: boolean): ResultTone {
  if (paid) return 'success';
  if (failed) return 'failed';
  return 'pending';
}

/** Tone brand — xanh primary thống nhất toàn trang */
const BRAND = {
  hero: 'from-primary via-primary-hover to-blue-300',
  glow: 'bg-blue-400/25',
  accent: 'text-primary',
  iconWrap: 'bg-white/15 text-white',
  iconRing: 'ring-white/20',
  bar: 'bg-primary',
} as const;

function StatusBadge({ tone }: { tone: ResultTone }) {
  if (tone === 'success') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-badge-primary-bg px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/15">
        <CheckCircle2 className="size-3.5" aria-hidden />
        Thành công
      </span>
    );
  }
  if (tone === 'failed') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200/80">
        <XCircle className="size-3.5" aria-hidden />
        Chưa hoàn tất
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-badge-primary-bg px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/15">
      <Clock3 className="size-3.5" aria-hidden />
      Đang xử lý
    </span>
  );
}

function ResultIcon({ tone }: { tone: ResultTone }) {
  return (
    <div
      className={cn(
        'flex size-20 items-center justify-center rounded-full ring-8 sm:size-24',
        BRAND.iconWrap,
        BRAND.iconRing,
      )}
    >
      {tone === 'success' ? (
        <CheckCircle2 className="size-10 sm:size-11" strokeWidth={1.75} aria-hidden />
      ) : tone === 'failed' ? (
        <XCircle className="size-10 sm:size-11" strokeWidth={1.75} aria-hidden />
      ) : (
        <Loader2 className="size-10 animate-spin sm:size-11" strokeWidth={1.75} aria-hidden />
      )}
    </div>
  );
}

export function PaymentResultPage() {
  const searchParams = useSearchParams();
  const { reloadSession } = useAuth();
  const urlStatus = searchParams.get('status');
  const urlCode = searchParams.get('code');
  const orderId = searchParams.get('orderId')?.trim() ?? null;
  const transactionRef = searchParams.get('transactionRef')?.trim() ?? null;

  const {
    initialLoading,
    syncing,
    paid,
    failed,
    expired,
    syncTimedOut,
  } = usePaymentResultStatus(orderId, urlStatus, urlCode);

  useEffect(() => {
    void reloadSession();
  }, [reloadSession]);

  useEffect(() => {
    if (paid) {
      window.dispatchEvent(new Event('notifications:refresh'));
    }
  }, [paid]);

  const tone = resolveTone(paid, failed);

  const title = paid
    ? 'Thanh toán thành công'
    : failed
      ? expired
        ? 'Đơn hàng đã hết hạn'
        : 'Thanh toán chưa hoàn tất'
      : 'Đang xử lý giao dịch';

  const subtitle = paid
    ? 'Cảm ơn bạn! Đơn hàng đã được ghi nhận. Mentor sẽ sớm liên hệ và bạn có thể theo dõi lịch học trong Mentoring.'
    : failed
      ? expired
        ? 'Thời hạn thanh toán đã qua. Bạn có thể đặt lại gói mentor hoặc xem chi tiết đơn hàng.'
        : 'Giao dịch chưa thành công hoặc đã bị hủy. Kiểm tra lại đơn hàng hoặc thử thanh toán lại.'
      : 'Hệ thống đang xác nhận với cổng thanh toán. Vui lòng đợi trong giây lát.';

  if (initialLoading) {
    return (
      <PageLoadingState
        label="Đang xác nhận kết quả thanh toán…"
        minHeight="min-h-[calc(100dvh-4.25rem)]"
      />
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-4.25rem)] w-full flex-1 flex-col bg-slate-100/80">
      {/* Hero dọc — full width */}
      <header
        className={cn(
          'relative flex w-full flex-col items-center overflow-hidden bg-linear-to-b px-5 pb-16 pt-10 text-center text-white sm:px-8 sm:pb-20 sm:pt-12',
          BRAND.hero,
        )}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className={cn('absolute left-1/2 top-0 size-96 -translate-x-1/2 rounded-full blur-3xl', BRAND.glow)} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.14),transparent_55%)]" />
        </div>

        <span className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-white/20">
          <Sparkles className="size-3.5" aria-hidden />
          Kết quả thanh toán
        </span>

        <div className="relative z-10 mt-8">
          <ResultIcon tone={tone} />
        </div>

        <h1 className="relative z-10 mt-6 max-w-xl text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          {title}
        </h1>
        <p className="relative z-10 mt-3 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
          {subtitle}
        </p>

        {syncing ? (
          <p className="relative z-10 mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/90 ring-1 ring-white/15">
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
            Đang đồng bộ trạng thái đơn hàng…
          </p>
        ) : null}
      </header>

      {/* Nội dung — card chồng lên hero, full width center */}
      <div className="relative z-20 mx-auto -mt-10 flex w-full max-w-lg flex-1 flex-col px-4 pb-10 sm:-mt-12 sm:max-w-xl sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.35)]">
          <div className={cn('h-1 w-full', BRAND.bar)} aria-hidden />

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <StatusBadge tone={tone} />
            </div>

            {syncTimedOut && paid ? (
              <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-600">
                Đơn hàng có thể cập nhật chậm vài phút. Bạn vẫn có thể xem trong mục Đơn hàng.
              </p>
            ) : null}

            {(orderId || transactionRef) ? (
              <dl className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/70">
                {orderId ? (
                  <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                    <dt className="inline-flex items-center gap-2 text-sm text-slate-500">
                      <Receipt className="size-4 shrink-0" aria-hidden />
                      Mã đơn
                    </dt>
                    <dd className="font-mono text-sm font-semibold text-slate-900">
                      {shortOrderId(orderId)}
                    </dd>
                  </div>
                ) : null}
                {transactionRef ? (
                  <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                    <dt className="inline-flex items-center gap-2 text-sm text-slate-500">
                      <ShoppingBag className="size-4 shrink-0" aria-hidden />
                      Mã giao dịch
                    </dt>
                    <dd className="max-w-[55%] truncate font-mono text-sm text-slate-800">
                      {transactionRef}
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}

            {paid ? (
              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className={cn('mt-0.5 size-4 shrink-0', BRAND.accent)} aria-hidden />
                  Thanh toán đã được cổng VNPay xác nhận
                </li>
                <li className="flex items-start gap-3">
                  <CalendarDays className={cn('mt-0.5 size-4 shrink-0', BRAND.accent)} aria-hidden />
                  Lịch mentoring sẽ hiển thị sau khi hệ thống kích hoạt booking
                </li>
              </ul>
            ) : null}

            <div className="mt-8 flex flex-col gap-3">
              {paid ? (
                <>
                  <Button href={MENTORING_PATH} variant="primary" className="w-full justify-center gap-2">
                    Xem Mentoring
                    <ArrowRight className="size-4" aria-hidden />
                  </Button>
                  {orderId ? (
                    <Button href={userOrderDetailPath(orderId)} variant="outline" className="w-full justify-center">
                      Chi tiết đơn hàng
                    </Button>
                  ) : (
                    <Button href="/dashboard/my-orders" variant="outline" className="w-full justify-center">
                      Đơn hàng của tôi
                    </Button>
                  )}
                </>
              ) : expired ? (
                <>
                  <Button href="/dashboard/find-mentors" variant="primary" className="w-full justify-center">
                    Đặt gói mới
                  </Button>
                  <Button href="/dashboard/my-orders" variant="outline" className="w-full justify-center">
                    Xem đơn hàng
                  </Button>
                </>
              ) : (
                <>
                  <Button href="/dashboard/my-orders" variant="primary" className="w-full justify-center">
                    Xem đơn hàng
                  </Button>
                  <Button href="/dashboard/find-mentors" variant="outline" className="w-full justify-center">
                    Thử thanh toán lại
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="mt-auto pt-8 text-center text-sm text-slate-500">
          Cần hỗ trợ?{' '}
          <Link href="/dashboard/chat" className="font-semibold text-primary hover:underline">
            Liên hệ qua tin nhắn
          </Link>
          {' · '}
          <Link href="/" className="font-semibold text-slate-700 hover:underline">
            Về trang chủ
          </Link>
        </p>

        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="size-3.5" aria-hidden />
          Giao dịch được bảo mật qua VNPay
        </p>
      </div>
    </div>
  );
}
