'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

export function useGoogleOAuthReturnNotice() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { success, error } = useToast();

  useEffect(() => {
    const google = searchParams.get('google');
    if (!google) return;

    if (google === 'connected') {
      success('Đã kết nối Google Calendar.');
    } else if (google === 'error') {
      error('Không thể kết nối Google Calendar. Vui lòng thử lại.');
    }

    router.replace(pathname);
  }, [searchParams, pathname, router, success, error]);
}
