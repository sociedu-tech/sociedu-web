'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProgramDetailPage } from '@/features/dashboard/hooks/useProgramDetailPage';
import { ProgramDetailView } from '@/features/dashboard/ui/programs/ProgramDetailView';
import { USER_PROGRAM } from '@/features/dashboard/lib/programLabels';

export function UserProgramDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = String(params?.bookingId ?? '');
  const highlightSessionId = searchParams.get('sessionId');
  const { item, order, reportRequests, loading, error, refresh } = useProgramDetailPage(bookingId, 'buyer');

  if (!bookingId) {
    return <ErrorMessage message="Không xác định được chương trình học." />;
  }

  if (loading && !item) {
    return <PageLoadingState label="Đang tải chi tiết chương trình…" />;
  }

  if (error && !item) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  if (!item) {
    return <ErrorMessage message="Không tìm thấy chương trình học." onRetry={refresh} />;
  }

  return (
    <ProgramDetailView
      item={item}
      order={order}
      reportRequests={reportRequests}
      onRefresh={refresh}
      labels={USER_PROGRAM}
      showChat
      showReview
      highlightSessionId={highlightSessionId}
    />
  );
}
