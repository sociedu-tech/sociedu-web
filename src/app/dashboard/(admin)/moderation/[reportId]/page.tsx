'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAdminModerationReportById } from '@/data/adminManagementMock';
import { listSlugForReport, moderationDetailPath } from '@/lib/moderationDetailRoutes';

/** URL cũ `/dashboard/moderation/[id]` → chuyển sang `/dashboard/moderation/{nhánh}/[id]`. */
export default function ModerationLegacyIdRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.reportId === 'string' ? params.reportId : '';

  useEffect(() => {
    if (!id) {
      router.replace('/dashboard/moderation');
      return;
    }
    const r = getAdminModerationReportById(id);
    if (!r) {
      router.replace('/dashboard/moderation');
      return;
    }
    router.replace(moderationDetailPath(listSlugForReport(r), id));
  }, [id, router]);

  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center text-sm text-slate-600">
      <p>Đang chuyển đến đúng nhánh báo cáo…</p>
      <p className="text-xs text-slate-400">Ví dụ: /dashboard/moderation/sessions/{id || '…'}</p>
    </div>
  );
}
