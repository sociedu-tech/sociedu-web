import type { AdminReportSegment } from '@/features/admin/hooks';

export function getModerationPageMeta(segment: AdminReportSegment): { title: string; description: string } {
  switch (segment) {
    case 'all':
      return {
        title: 'Báo cáo — Tất cả',
        description:
          'Danh sách mọi báo cáo / khiếu nại. Cập nhật trạng thái: mới → đang xử lý → đã xử lý / bỏ qua. Dùng menu bên trái để lọc theo loại.',
      };
    case 'people':
      return {
        title: 'Báo cáo — Người dùng & mentor',
        description: 'Phản ánh liên quan tài khoản học viên, mentor hoặc hành vi trên nền tảng.',
      };
    case 'review':
      return {
        title: 'Báo cáo — Đánh giá',
        description: 'Nội dung đánh giá không phù hợp, spam hoặc sai sự thật.',
      };
    case 'session':
      return {
        title: 'Báo cáo — Buổi học & tranh chấp',
        description: 'Khiếu nại sau buổi học: mở chi tiết để xem minh chứng, giai đoạn xử lý và quyết định admin.',
      };
  }
}
