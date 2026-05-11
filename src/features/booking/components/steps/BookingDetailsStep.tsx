'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useBookingStore } from '../../store/useBookingStore';
import { useCheckoutBooking } from '../../hooks/useBookingMutations';
import { usePackagesForBooking } from '../../hooks/usePackagesForBooking';
import { bookingFormSchema, type BookingFormData } from '../../schemas/bookingFormSchema';
import { getSelectedPackageSummary } from '../../services/slotService';
import { buildCheckoutOrderInfo } from '../../services/checkoutService';

export function BookingDetailsStep() {
  const {
    mentorId,
    selectedPackageId,
    selectedVersionId,
    goals,
    questions,
    portfolioUrl,
    setFormField,
    setPayment,
    transitionTo,
  } = useBookingStore();
  const checkoutBooking = useCheckoutBooking();
  const { data: packages } = usePackagesForBooking(mentorId);
  const { selectedPackage } = getSelectedPackageSummary(
    packages,
    selectedPackageId,
    selectedVersionId,
  );

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      goals,
      questions,
      portfolioUrl,
    },
    mode: 'onBlur',
  });

  const isSubmitting = checkoutBooking.isPending;

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!selectedVersionId) {
      toast.error('Vui lòng chọn gói mentoring trước khi thanh toán.');
      transitionTo('SELECTING_PACKAGE');
      return;
    }

    transitionTo('SUBMITTING');
    try {
      const order = await checkoutBooking.mutateAsync({
        servicePackageVersionId: selectedVersionId,
        orderInfo: buildCheckoutOrderInfo(selectedPackage?.name, values),
      });

      if (order.paymentUrl) {
        setPayment(order.paymentUrl);
        transitionTo('PAYMENT_PENDING');
        window.location.href = order.paymentUrl;
        return;
      }

      throw new Error('Backend không trả về paymentUrl cho đơn hàng.');
    } catch (error) {
      transitionTo('FILLING_DETAILS');
      toast.error(error instanceof Error ? error.message : 'Không thể xác nhận đặt lịch.');
    }
  });

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <h3 className="text-lg font-bold text-gray-900">Chi tiết buổi mentoring</h3>
        <p className="mt-1 text-sm text-gray-500">
          Mentor sẽ dùng thông tin này để chuẩn bị nội dung phù hợp trước buổi hẹn.
        </p>
      </div>

      <FieldBlock
        label="Mục tiêu của bạn"
        error={form.formState.errors.goals?.message}
        hint="Tối thiểu 10 ký tự."
      >
        <textarea
          rows={5}
          {...form.register('goals', {
            onChange: (event) => setFormField('goals', event.target.value),
          })}
          className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
          placeholder="Ví dụ: Em muốn mentor review hướng làm đồ án web, góp ý kiến trúc và checklist trước khi bảo vệ."
        />
      </FieldBlock>

      <FieldBlock
        label="Câu hỏi muốn trao đổi"
        error={form.formState.errors.questions?.message}
        hint="Không bắt buộc."
      >
        <textarea
          rows={4}
          {...form.register('questions', {
            onChange: (event) => setFormField('questions', event.target.value),
          })}
          className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
          placeholder="Liệt kê các câu hỏi cụ thể để mentor chuẩn bị trước."
        />
      </FieldBlock>

      <FieldBlock
        label="Portfolio hoặc tài liệu tham khảo"
        error={form.formState.errors.portfolioUrl?.message}
        hint="Không bắt buộc."
      >
        <input
          type="url"
          {...form.register('portfolioUrl', {
            onChange: (event) => setFormField('portfolioUrl', event.target.value),
          })}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
          placeholder="https://..."
        />
      </FieldBlock>

      <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => transitionTo('SELECTING_PACKAGE')}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Quay lại
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          Xác nhận và thanh toán
        </button>
      </div>
    </form>
  );
}

function FieldBlock({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-gray-900">{label}</span>
      {hint && <span className="ml-2 text-xs font-medium text-gray-400">{hint}</span>}
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-1.5 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}
