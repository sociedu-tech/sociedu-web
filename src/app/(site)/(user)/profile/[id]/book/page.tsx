import { Suspense } from 'react';
import { MentorBookingPage } from '@/features/user/views/MentorBookingPage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ProfileBookingRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner label="Đang tải..." />
        </div>
      }
    >
      <MentorBookingPage />
    </Suspense>
  );
}
