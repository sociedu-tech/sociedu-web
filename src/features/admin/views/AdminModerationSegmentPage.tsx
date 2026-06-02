import { DashboardPage, DashboardSurface } from '@/features/dashboard/ui/DashboardPrimitives';
import type { AdminReportSegment } from '@/features/admin/hooks/useAdminModerationReportsView';
import { AdminModerationReportsView } from '@/features/admin/views/AdminModerationReportsView';

export function AdminModerationSegmentPage({ segment }: { segment: AdminReportSegment }) {
  return (
    <DashboardPage>
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminModerationReportsView segment={segment} />
        </div>
      </DashboardSurface>
    </DashboardPage>
  );
}
