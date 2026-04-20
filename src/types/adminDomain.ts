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

/** Tranh chấp sau buổi học — minh chứng & quy trình xử lý (admin). */
export type SessionDisputeParty = 'learner' | 'mentor' | 'admin';

export type SessionDisputePhase =
  | 'submitted'
  | 'evidence'
  | 'admin_review'
  | 'decision'
  | 'closed';

export interface SessionDisputeEvidence {
  id: string;
  party: SessionDisputeParty;
  uploadedAt: string;
  title: string;
  detail: string;
  /** Nhãn file minh chứng (demo) */
  fileLabel?: string;
}

export interface SessionDisputeStage {
  phase: SessionDisputePhase;
  label: string;
  description: string;
  done: boolean;
  /** Thời điểm hoàn thành bước (nếu có) */
  completedAt?: string;
}

export interface SessionDisputeDetail {
  sessionCode: string;
  sessionAt: string;
  menteeName: string;
  mentorName: string;
  /** Ai khởi tạo khiếu nại */
  openedByParty: SessionDisputeParty;
  /** Lý do / tường trình phía mở khiếu nại */
  openerStatement: string;
  /** Lý do / phản hồi phía còn lại */
  counterStatement: string;
  currentPhase: SessionDisputePhase;
  /** Các giai đoạn xử lý (admin + các bên nộp minh chứng) */
  stages: SessionDisputeStage[];
  evidence: SessionDisputeEvidence[];
  /** Kết luận / ghi chú admin (sau quyết định) */
  adminResolutionNote?: string;
}

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
  /** Chỉ khi `targetType === 'session'`: quy trình tranh chấp + minh chứng */
  sessionDispute?: SessionDisputeDetail;
}
