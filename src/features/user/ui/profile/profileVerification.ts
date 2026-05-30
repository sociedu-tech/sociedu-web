import type { User } from '@/types';

export type MentorVerificationUi = 'verified' | 'pending' | 'rejected' | 'unknown';

export function getMentorVerificationStatus(user: User): MentorVerificationUi {
  const raw = user.mentorInfo?.verificationStatus;
  if (raw === 'verified' || raw === 'rejected' || raw === 'pending') return raw;
  return 'unknown';
}

export function isMentorVerified(user: User): boolean {
  return getMentorVerificationStatus(user) === 'verified';
}

export const verificationCopy: Record<
  MentorVerificationUi,
  { label: string; title: string; description: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }
> = {
  verified: {
    label: 'Đã xác thực',
    title: 'Mentor đã được xác minh',
    description:
      'Hồ sơ đã qua kiểm duyệt. Bạn có thể xem gói dịch vụ và đặt lịch an tâm.',
    tone: 'success',
  },
  pending: {
    label: 'Chờ xác thực',
    title: 'Đang chờ xác minh',
    description:
      'Mentor đang trong quá trình duyệt hồ sơ. Vui lòng quay lại sau khi trạng thái chuyển sang Đã xác thực.',
    tone: 'warning',
  },
  rejected: {
    label: 'Chưa đạt',
    title: 'Hồ sơ chưa được duyệt',
    description: 'Hồ sơ mentor chưa đạt yêu cầu xác minh. Liên hệ mentor hoặc chọn mentor khác.',
    tone: 'danger',
  },
  unknown: {
    label: 'Chưa rõ',
    title: 'Chưa có trạng thái xác thực',
    description: 'Thông tin xác minh chưa được cập nhật từ hệ thống.',
    tone: 'neutral',
  },
};
