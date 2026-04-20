import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { AdminModerationReportDetailView } from '@/features/admin/views/AdminModerationReportDetailView';

export default function AdminModerationDetailPeoplePage() {
  return (
    <>
      <DashboardViewHeader
        title="Chi tiết báo cáo"
        description="Người dùng & mentor — xử lý phản ánh."
        layout="compact"
      />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminModerationReportDetailView listSlug="people" />
        </div>
      </DashboardSurface>
    </>
  );
}
