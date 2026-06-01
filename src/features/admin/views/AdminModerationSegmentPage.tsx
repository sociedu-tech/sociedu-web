import { DashboardPage, DashboardSurface, DashboardViewHeader } from '@/features/dashboard/ui/DashboardPrimitives';
import { getModerationPageMeta } from '@/features/admin/moderationPageMeta';
import type { AdminReportSegment } from '@/features/admin/hooks/useAdminModerationReportsView';
import { AdminModerationReportsView } from '@/features/admin/views/AdminModerationReportsView';

export function AdminModerationSegmentPage({ segment }: { segment: AdminReportSegment }) {
  const meta = getModerationPageMeta(segment);
  return (
    <DashboardPage>
      <DashboardViewHeader title={meta.title} description={meta.description} layout="compact" />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminModerationReportsView segment={segment} />
        </div>
      </DashboardSurface>
    </DashboardPage>
  );
}
