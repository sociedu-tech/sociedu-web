import { DashboardPage, DashboardSurface } from '@/features/dashboard/ui/DashboardPrimitives';
import { AdminModerationReportDetailView } from '@/features/admin/views/AdminModerationReportDetailView';

export default function AdminModerationDetailSessionsPage() {
  return (
    <DashboardPage>
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminModerationReportDetailView listSlug="sessions" />
        </div>
      </DashboardSurface>
    </DashboardPage>
  );
}
