'use client';

import { useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProgramDetailPage } from '@/features/dashboard/hooks/useProgramDetailPage';
import { ProgramReportPageView } from '@/features/dashboard/ui/programs/ProgramReportPageView';
import { MENTOR_PROGRAM } from '@/features/dashboard/lib/programLabels';

export function MentorProgramReportPage() {
  const params = useParams();
  const bookingId = String(params?.bookingId ?? '');
  const { item, order, loading, error, refresh } = useProgramDetailPage(bookingId, 'mentor');

  if (!bookingId) {
    return <ErrorMessage message="Không xác định được chương trình mentoring." />;
  }

  if (loading && !item) {
    return <LoadingSpinner label="Đang tải thông tin lộ trình…" />;
  }

  if (error && !item) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  if (!item) {
    return <ErrorMessage message="Không tìm thấy chương trình mentoring." onRetry={refresh} />;
  }

  return (
    <ProgramReportPageView
      item={item}
      labels={MENTOR_PROGRAM}
      orderPackageName={order?.packageName}
    />
  );
}
