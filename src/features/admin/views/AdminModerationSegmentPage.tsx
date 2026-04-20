import { ADMIN_MANAGEMENT_REPORTS } from '@/data/adminManagementMock';
import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { getModerationPageMeta } from '@/features/admin/moderationPageMeta';
import type { AdminReportSegment } from '@/features/admin/hooks/useAdminModerationReportsView';
import { AdminModerationReportsView } from '@/features/admin/views/AdminModerationReportsView';

export function AdminModerationSegmentPage({ segment }: { segment: AdminReportSegment }) {
  const meta = getModerationPageMeta(segment);
  return (
    <>
      <DashboardViewHeader title={meta.title} description={meta.description} layout="compact" />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminModerationReportsView initialReports={ADMIN_MANAGEMENT_REPORTS} segment={segment} />
        </div>
      </DashboardSurface>
    </>
  );
}
