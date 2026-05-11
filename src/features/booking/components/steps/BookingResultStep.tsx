'use client';

import { AlertCircle, CheckCircle2, Clock, ExternalLink, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useBookingStore } from '../../store/useBookingStore';
import type { BookingFlowState } from '../../constants/bookingStates';

const COPY: Partial<Record<BookingFlowState, { title: string; description: string }>> = {
  PAYMENT_PENDING: {
    title: 'Đang chờ xác nhận thanh toán',
    description: 'Nếu trình thanh toán chưa mở, bạn có thể mở lại bằng nút bên dưới.',
  },
  PAYMENT_SUCCESS: {
    title: 'Đặt lịch thành công',
    description: 'Booking đã được ghi nhận. Bạn có thể xem lịch hẹn trong trang quản lý.',
  },
  PAYMENT_FAILED: {
    title: 'Thanh toán chưa thành công',
    description: 'Bạn có thể thử lại thanh toán hoặc quay về chỉnh thông tin đặt lịch.',
  },
  EXPIRED: {
    title: 'Lịch giữ chỗ đã hết hạn',
    description: 'Vui lòng chọn lại khung giờ để giữ lịch mới.',
  },
  ERROR: {
    title: 'Không thể hoàn tất đặt lịch',
    description: 'Vui lòng kiểm tra lại thông tin hoặc thử lại sau.',
  },
};

export function BookingResultStep({ flowState }: { flowState: BookingFlowState }) {
  const { paymentUrl, forceClose, transitionTo } = useBookingStore();
  const copy = COPY[flowState] ?? COPY.ERROR!;
  const isSuccess = flowState === 'PAYMENT_SUCCESS';
  const isPending = flowState === 'PAYMENT_PENDING';

  const Icon = isSuccess ? CheckCircle2 : isPending ? Clock : AlertCircle;
  const colorClass = isSuccess
    ? 'text-green-600 bg-green-50 border-green-100'
    : isPending
      ? 'text-blue-600 bg-blue-50 border-blue-100'
      : 'text-red-600 bg-red-50 border-red-100';

  return (
    <div className="flex min-h-96 flex-col items-center justify-center px-6 py-12 text-center">
      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${colorClass}`}>
        <Icon className="h-8 w-8" aria-hidden />
      </div>
      <h3 className="mt-5 text-xl font-black text-gray-900">{copy.title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">{copy.description}</p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        {isPending && paymentUrl && (
          <a
            href={paymentUrl}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            Mở thanh toán
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        )}

        {isSuccess && (
          <Link
            href="/dashboard/bookings"
            onClick={forceClose}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            Xem lịch hẹn
          </Link>
        )}

        {(flowState === 'PAYMENT_FAILED' || flowState === 'EXPIRED' || flowState === 'ERROR') && (
          <button
            type="button"
            onClick={() => transitionTo(flowState === 'EXPIRED' ? 'SELECTING_PACKAGE' : 'FILLING_DETAILS')}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-black"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Thử lại
          </button>
        )}

        <button
          type="button"
          onClick={forceClose}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
