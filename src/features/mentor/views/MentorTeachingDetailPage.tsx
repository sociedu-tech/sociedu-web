'use client';

import { useParams } from 'next/navigation';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProgramDetailPage } from '@/features/dashboard/hooks/useProgramDetailPage';
import { ProgramDetailView } from '@/features/dashboard/ui/programs/ProgramDetailView';
import { MENTOR_PROGRAM } from '@/features/dashboard/lib/programLabels';

export function MentorTeachingDetailPage() {
  const params = useParams();
  const bookingId = String(params?.bookingId ?? '');
  const { item, order, loading, error, refresh } = useProgramDetailPage(bookingId, 'mentor');

  if (!bookingId) {
    return <ErrorMessage message="Không xác định được chương trình mentoring." />;
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

  return (
    <ProgramDetailView
      item={item}
      order={order}
      onRefresh={refresh}
      labels={MENTOR_PROGRAM}
      showChat
    />
  );
}
