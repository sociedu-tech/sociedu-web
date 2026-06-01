'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import type { BookingStatus } from '@/types';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useAdminProgramDetail } from '@/features/admin/hooks/useAdminProgramDetail';
import { AdminProgramDetailView } from '@/features/admin/ui/AdminProgramDetailView';

export function AdminProgramDetailPage() {
  const params = useParams();
  const bookingId = String(params?.bookingId ?? params?.id ?? '');
  const { item, loading, error, refresh } = useAdminProgramDetail(bookingId);
  const [statusOverride, setStatusOverride] = useState<BookingStatus | null>(null);

  if (!bookingId) {
    return <ErrorMessage message="Không xác định được chương trình." />;
  }

  if (loading) {
    return <PageLoadingState label="Đang tải chi tiết chương trình…" />;
  }

  if (error && !item) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  if (!item) {
    return <ErrorMessage message="Không tìm thấy chương trình mentoring." onRetry={refresh} />;
  }

  const row = statusOverride ? { ...item, status: statusOverride } : item;

  return (
    <AdminProgramDetailView
      row={row}
      onStatusChange={(_id, status) => setStatusOverride(status)}
    />
  );
}
