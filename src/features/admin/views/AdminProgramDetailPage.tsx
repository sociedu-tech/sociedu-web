'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import type { BookingStatus } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useAdminProgramDetail } from '@/features/admin/hooks/useAdminProgramDetail';
import { AdminProgramDetailView } from '@/features/admin/ui/AdminProgramDetailView';
import { bookingService } from '@/services/bookingService';

export function AdminProgramDetailPage() {
  const params = useParams();
  const bookingId = String(params?.bookingId ?? params?.id ?? '');
  const { item, loading, error, refresh } = useAdminProgramDetail(bookingId);
  const [statusOverride, setStatusOverride] = useState<BookingStatus | null>(null);

  if (!bookingId) {
    return <ErrorMessage message="Không xác định được chương trình." />;
  }

  if (loading && !item) {
    return <LoadingSpinner label="Đang tải chi tiết chương trình…" />;
  }

  if (error && !item) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  if (!item) {
    return <ErrorMessage message="Không tìm thấy chương trình mentoring." onRetry={refresh} />;
  }

  const handleStatusChange = async (_id: string, status: BookingStatus) => {
    if (status === 'cancelled_by_user' || status === 'cancelled_by_mentor' || status === 'no_show') {
      const reason = prompt('Nhập lý do hủy đặt lịch:') || 'Admin hủy bỏ';
      setStatusOverride(status);
      try {
        await bookingService.cancelBooking(bookingId, reason);
        await refresh();
      } catch (err: unknown) {
        console.error('Lỗi khi hủy booking:', err);
        alert(err instanceof Error ? err.message : 'Lỗi khi hủy booking');
        setStatusOverride(null);
        await refresh();
      }
    } else {
      alert('Thay đổi trạng thái này do hệ thống điều khiển tự động qua luồng thanh toán và xác nhận buổi học.');
    }
  };

  const row = statusOverride ? { ...item, status: statusOverride } : item;

  return (
    <AdminProgramDetailView
      row={row}
      onStatusChange={handleStatusChange}
    />
  );
}
