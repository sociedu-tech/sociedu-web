import { Suspense } from 'react';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { PaymentResultPage } from '@/features/payment/views/PaymentResultPage';

export default function PaymentResultRoute() {
  return (
    <Suspense
      fallback={
        <PageLoadingState
          label="Đang tải kết quả thanh toán…"
          minHeight="min-h-[calc(100dvh-4.25rem)]"
        />
      }
    >
      <PaymentResultPage />
    </Suspense>
  );
}
