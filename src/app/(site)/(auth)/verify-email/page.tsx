import { Suspense } from 'react';
import { VerifyEmailPage } from '@/features/auth/views/VerifyEmailPage';

export default function VerifyEmailRoute() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPage />
    </Suspense>
  );
}
