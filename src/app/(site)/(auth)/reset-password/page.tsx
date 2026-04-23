import { Suspense } from 'react';
import { ResetPasswordPage } from '@/features/auth/views/ResetPasswordPage';

export default function ResetPasswordRoute() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  );
}
