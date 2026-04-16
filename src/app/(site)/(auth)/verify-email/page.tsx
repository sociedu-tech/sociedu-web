import { Suspense } from 'react';
import { VerifyEmailPage } from '@/views/auth/VerifyEmailPage';

export default function VerifyEmailRoute() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPage />
    </Suspense>
  );
}
