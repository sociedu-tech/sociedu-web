'use client';

import { Suspense } from 'react';
import { useGoogleOAuthReturnNotice } from '@/features/dashboard/hooks/useGoogleOAuthReturnNotice';

function GoogleOAuthReturnNoticeInner() {
  useGoogleOAuthReturnNotice();
  return null;
}

export function GoogleOAuthReturnNotice() {
  return (
    <Suspense fallback={null}>
      <GoogleOAuthReturnNoticeInner />
    </Suspense>
  );
}
