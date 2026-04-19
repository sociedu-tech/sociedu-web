import type { User } from '@/types';

/** Trạng thái tài khoản trên nền tảng */
export type UserAccountStatus = 'active' | 'suspended' | 'pending';

/** Dòng người dùng trong bảng quản trị */
export interface AdminUserRow extends User {
  accountStatus: UserAccountStatus;
  /** Ghi chú nội bộ (mẫu) */
  adminNote?: string;
}

/** Trạng thái booking / buổi đặt lịch */
export type BookingStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled_by_user'
  | 'cancelled_by_mentor'
  | 'no_show';

export interface AdminBookingRow {
  id: string;
  code: string;
  learnerName: string;
  learnerId: string;
  mentorName: string;
  mentorId: string;
  /** Thời gian bắt đầu hiển thị */
  scheduledAt: string;
  durationMin: number;
  status: BookingStatus;
  packageTitle: string;
  amountVnd: number;
  createdAt: string;
}

/** Đối tượng bị báo cáo */
export type ModerationTargetType = 'user' | 'mentor' | 'booking' | 'session' | 'review';

export type ModerationReportStatus = 'open' | 'in_review' | 'resolved' | 'dismissed';

export interface AdminModerationReport {
  id: string;
  createdAt: string;
  reporterName: string;
  reporterId: string;
  targetType: ModerationTargetType;
  /** Mô tả ngắn: ID hoặc tiêu đề thực thể */
  targetLabel: string;
  category: string;
  summary: string;
  status: ModerationReportStatus;
  priority: 'low' | 'normal' | 'high';
}
