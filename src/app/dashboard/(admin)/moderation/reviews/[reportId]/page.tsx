import { DashboardSurface } from '@/features/dashboard/ui/modules/layout/DashboardSurface';
import { DashboardViewHeader } from '@/features/dashboard/ui/modules/layout/DashboardViewHeader';
import { AdminModerationReportDetailView } from '@/features/admin/views/AdminModerationReportDetailView';

export default function AdminModerationDetailReviewsPage() {
  return (
    <>
      <DashboardViewHeader
        title="Chi tiết báo cáo"
        description="Đánh giá / review — xử lý nội dung."
        layout="compact"
      />
      <DashboardSurface>
        <div className="p-4 sm:p-6">
          <AdminModerationReportDetailView listSlug="reviews" />
        </div>
      </DashboardSurface>
    </>
  );
}
