import { Suspense } from 'react';
import { MentorBookingPage } from '@/features/user/views/MentorBookingPage';
import { PageLoadingState } from '@/components/ui/PageLoadingState';

export default function ProfileBookingRoutePage() {
  return (
    <Suspense fallback={<PageLoadingState label="Đang tải…" minHeight="min-h-[50vh]" />}>
      <MentorBookingPage />
    </Suspense>
  );
}
