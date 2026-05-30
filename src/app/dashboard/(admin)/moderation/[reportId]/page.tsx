'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

/** URL cũ `/dashboard/moderation/[id]` → chuyển sang `/dashboard/moderation/all/[id]`. */
export default function ModerationLegacyIdRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.reportId === 'string' ? params.reportId : '';

  useEffect(() => {
    if (!id) {
      router.replace('/dashboard/moderation');
      return;
    }
    router.replace(`/dashboard/moderation/all/${id}`);
  }, [id, router]);

  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center text-sm text-slate-600">
      <p>Đang chuyển đến chi tiết báo cáo…</p>
    </div>
  );
}
