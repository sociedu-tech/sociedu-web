'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const status = (searchParams.get('status') ?? '').toLowerCase();
  const orderId = searchParams.get('orderId');
  const code = searchParams.get('code');
  const isMock = searchParams.get('mock') === 'true';

  const isSuccess =
    status === 'success' || status === 'paid' || code === '00';

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      {isSuccess ? (
        <CheckCircle2 className="mb-6 h-20 w-20 text-emerald-600" aria-hidden />
      ) : (
        <XCircle className="mb-6 h-20 w-20 text-red-500" aria-hidden />
      )}

      <h1 className="text-2xl font-semibold text-foreground">
        {isSuccess ? 'Thanh toán thành công' : 'Thanh toán chưa hoàn tất'}
      </h1>

      <p className="mt-3 text-muted-foreground">
        {isSuccess
          ? isMock
            ? 'Đơn hàng đã được ghi nhận (chế độ thử nghiệm, không qua cổng VNPay).'
            : 'Đơn hàng của bạn đã được xác nhận. Bạn có thể xem buổi học trong mục Phiên học.'
          : 'Giao dịch chưa thành công hoặc đã bị hủy. Vui lòng thử lại hoặc liên hệ hỗ trợ.'}
      </p>

      {orderId ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Mã đơn: <span className="font-mono text-foreground">{orderId}</span>
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/dashboard/sessions" variant="primary">
          Xem phiên học
        </Button>
        <Button href="/dashboard" variant="outline">
          Về bảng điều khiển
        </Button>
      </div>
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
