import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { AdminModerationReportDetailView } from '@/features/admin/views/AdminModerationReportDetailView';

export default function AdminModerationDetailSessionsPage() {
  return (
    <>
      <DashboardViewHeader
        title="Chi tiết tranh chấp buổi học"
        description="Tiến độ, minh chứng và phân xử (demo trên trình duyệt)."
        layout="compact"
      />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminModerationReportDetailView listSlug="sessions" />
        </div>
      </DashboardSurface>
    </>
  );
}
