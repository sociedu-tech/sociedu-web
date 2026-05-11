'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useVerifyPayment } from '@/features/booking/hooks/useBookingMutations';
import {
  isFailedPaymentStatus,
  isSuccessfulPaymentStatus,
} from '@/features/booking/services/checkoutService';

export function PaymentCallbackClient() {
  const searchParams = useSearchParams();
  const verifyPayment = useVerifyPayment();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (Object.keys(params).length > 0 && verifyPayment.isIdle) {
      verifyPayment.mutate(params);
    }
  }, [searchParams, verifyPayment]);

  const data = verifyPayment.data;
  const isSuccess = isSuccessfulPaymentStatus(data?.status);
  const isFailed = verifyPayment.isError || isFailedPaymentStatus(data?.status);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        {verifyPayment.isPending || verifyPayment.isIdle ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
              <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
            </div>
            <h1 className="mt-5 text-xl font-black text-gray-900">Đang xác nhận thanh toán</h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Vui lòng chờ trong giây lát, hệ thống đang kiểm tra kết quả từ VNPay.
            </p>
          </>
        ) : isSuccess ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-green-100 bg-green-50 text-green-600">
              <CheckCircle2 className="h-8 w-8" aria-hidden />
            </div>
            <h1 className="mt-5 text-xl font-black text-gray-900">Thanh toán thành công</h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Booking của bạn đã được ghi nhận. Bạn có thể xem lại trong trang quản lý lịch hẹn.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600">
              <AlertCircle className="h-8 w-8" aria-hidden />
            </div>
            <h1 className="mt-5 text-xl font-black text-gray-900">Thanh toán chưa thành công</h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {isFailed && verifyPayment.error instanceof Error
                ? verifyPayment.error.message
                : data?.message || 'Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'}
            </p>
          </>
        )}

        <div className="mt-7 flex flex-col gap-3">
          <Link
            href="/dashboard/bookings"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            Xem lịch hẹn
          </Link>
          <Link
            href="/mentors"
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            Tìm mentor khác
          </Link>
        </div>
      </section>
    </main>
  );
}
