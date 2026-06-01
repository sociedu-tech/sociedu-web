'use client';

import { useParams } from 'next/navigation';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProgramDetailPage } from '@/features/dashboard/hooks/useProgramDetailPage';
import { ProgramReportPageView } from '@/features/dashboard/ui/programs/ProgramReportPageView';
import { USER_PROGRAM } from '@/features/dashboard/lib/programLabels';

export function UserProgramReportPage() {
  const params = useParams();
  const bookingId = String(params?.bookingId ?? '');
  const { item, order, loading, error, refresh } = useProgramDetailPage(bookingId, 'buyer');

  if (!bookingId) {
    return <ErrorMessage message="Không xác định được chương trình học." />;
  }

  if (loading && !item) {
    return <PageLoadingState label="Đang tải thông tin lộ trình…" />;
  }

  if (error && !item) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  if (!item) {
    return <ErrorMessage message="Không tìm thấy chương trình học." onRetry={refresh} />;
  }

  return (
    <ProgramReportPageView
      item={item}
      labels={USER_PROGRAM}
      orderPackageName={order?.packageName}
    />
  );
}
