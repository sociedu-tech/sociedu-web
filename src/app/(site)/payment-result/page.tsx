'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { useEffect, useState } from 'react';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';
import { MENTORING_PATH } from '@/features/dashboard/lib/programLabels';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const status = (searchParams.get('status') ?? '').toLowerCase();
  const orderId = searchParams.get('orderId');
  const code = searchParams.get('code');

  const isSuccess =
    status === 'success' || status === 'paid' || code === '00';
  const [loading, setLoading] = useState(Boolean(orderId));
  const [polledStatus, setPolledStatus] = useState<string | null>(null);
  const [pollReady, setPollReady] = useState(!orderId);
  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;
    if (!orderId) return;

    const attempt = async () => {
      setLoading(true);
      let statusValue: string | null = null;
      try {
        const order = await orderService.getOrderById(orderId);
        statusValue = String(order.status ?? '');
      } catch {
        try {
          const p = await paymentService.getPaymentStatusByOrderId(orderId);
          statusValue = String((p as { status?: string })?.status ?? '');
        } catch {
          // ignore
        }
      }

      if (cancelled) return;
      setPolledStatus(statusValue);
      setPollReady(true);

      const s = (statusValue ?? '').toLowerCase();
      if (s === 'paid' || s === 'completed') {
        setLoading(false);
        return;
      }

      timer = window.setTimeout(attempt, 1500);
    };

    void attempt();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderId]);

  const paid =
    isSuccess ||
    polledStatus?.toLowerCase() === 'paid' ||
    polledStatus?.toLowerCase() === 'completed';

  if (orderId && !pollReady && !isSuccess) {
    return (
      <PageLoadingState
        label="Đang kiểm tra trạng thái thanh toán…"
        minHeight="min-h-[60vh]"
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      {paid ? (
        <CheckCircle2 className="mb-6 h-20 w-20 text-emerald-600" aria-hidden />
      ) : (
        <XCircle className="mb-6 h-20 w-20 text-red-500" aria-hidden />
      )}

      <h1 className="text-2xl font-semibold text-foreground">
        {paid ? 'Thanh toán thành công' : 'Thanh toán chưa hoàn tất'}
      </h1>

      <p className="mt-3 text-muted-foreground">
        {paid
          ? 'Đơn hàng của bạn đã được xác nhận. Bạn có thể xem buổi học trong mục Phiên học.'
          : 'Giao dịch chưa thành công hoặc đã bị hủy. Vui lòng thử lại hoặc liên hệ hỗ trợ.'}
      </p>

      {orderId ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Mã đơn: <span className="font-mono text-foreground">{orderId}</span>
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {paid ? (
          <>
            <Button href={MENTORING_PATH} variant="primary">
              Xem Mentoring
            </Button>
            <Button href="/dashboard/my-orders" variant="outline">
              Đơn hàng của tôi
            </Button>
          </>
        ) : polledStatus?.toLowerCase() === 'expired' ? (
          <>
            <Button href="/dashboard/find-mentors" variant="primary">
              Đặt gói mới
            </Button>
            <Button href="/dashboard/my-orders" variant="outline">
              Xem đơn hàng
            </Button>
          </>
        ) : (
          <>
            <Button href="/dashboard/my-orders" variant="primary">
              Xem đơn hàng
            </Button>
            <Button href="/dashboard/find-mentors" variant="outline">
              Thử thanh toán lại
            </Button>
          </>
        )}
        <Button href="/dashboard" variant="outline">
          Bảng điều khiển
        </Button>
      </div>
      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          Đang cập nhật trạng thái…
        </p>
      ) : null}
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<PageLoadingState label="Đang tải kết quả…" minHeight="min-h-[60vh]" />}>
      <PaymentResultContent />
    </Suspense>
  );
}
