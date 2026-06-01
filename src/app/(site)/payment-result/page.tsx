'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const status = (searchParams.get('status') ?? '').toLowerCase();
  const orderId = searchParams.get('orderId');
  const code = searchParams.get('code');

  const isSuccess =
    status === 'success' || status === 'paid' || code === '00';
  const [loading, setLoading] = useState(false);
  const [polledStatus, setPolledStatus] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;
    if (!orderId) return;
    setLoading(true);
    const attempt = async () => {
      try {
        const order = await orderService.getOrderById(orderId);
        if (cancelled) return;
        setPolledStatus(String(order.status ?? ''));
        // stop polling if paid/completed
        const s = String(order.status ?? '').toLowerCase();
        if (s === 'paid' || s === 'completed') {
          setLoading(false);
          return;
        }
      } catch (err) {
        // fallback to paymentService
        try {
        const p = await paymentService.getPaymentStatusByOrderId(orderId);
        if (cancelled) return;
        setPolledStatus(String((p as any)?.status ?? ''));
        } catch {
          // ignore
        }
      }
      if (!cancelled) {
        timer = window.setTimeout(attempt, 1500);
      }
    };
    attempt();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderId]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      {(isSuccess || polledStatus?.toLowerCase() === 'paid' || polledStatus?.toLowerCase() === 'completed') ? (
        <CheckCircle2 className="mb-6 h-20 w-20 text-emerald-600" aria-hidden />
      ) : (
        <XCircle className="mb-6 h-20 w-20 text-red-500" aria-hidden />
      )}

      <h1 className="text-2xl font-semibold text-foreground">
        {(isSuccess || polledStatus?.toLowerCase() === 'paid' || polledStatus?.toLowerCase() === 'completed')
          ? 'Thanh toán thành công'
          : 'Thanh toán chưa hoàn tất'}
      </h1>

      <p className="mt-3 text-muted-foreground">
        {(isSuccess || polledStatus?.toLowerCase() === 'paid' || polledStatus?.toLowerCase() === 'completed')
          ? 'Đơn hàng của bạn đã được xác nhận. Bạn có thể xem buổi học trong mục Phiên học.'
          : 'Giao dịch chưa thành công hoặc đã bị hủy. Vui lòng thử lại hoặc liên hệ hỗ trợ.'}
      </p>

      {orderId ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Mã đơn: <span className="font-mono text-foreground">{orderId}</span>
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {(isSuccess || polledStatus?.toLowerCase() === 'paid' || polledStatus?.toLowerCase() === 'completed') ? (
          <>
            <Button href="/dashboard/sessions" variant="primary">
              Xem buổi học
            </Button>
            <Button href="/dashboard/my-orders" variant="outline">
              Đơn hàng của tôi
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
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang kiểm tra trạng thái thanh toán...
        </div>
      ) : null}
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          Đang tải kết quả...
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
