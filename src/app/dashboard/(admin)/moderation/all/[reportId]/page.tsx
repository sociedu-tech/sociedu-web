import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { AdminModerationReportDetailView } from '@/features/admin/views/AdminModerationReportDetailView';

export default function AdminModerationDetailAllPage() {
  return (
    <>
      <DashboardViewHeader
        title="Chi tiết báo cáo"
        description="Booking và các loại khác (nhánh Tất cả)."
        layout="compact"
      />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminModerationReportDetailView listSlug="all" />
        </div>
      </DashboardSurface>
    </>
  );
}
