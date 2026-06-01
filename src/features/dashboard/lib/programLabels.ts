/** Nhãn UI theo vai trò — mentoring. */

import {
  mentorOrderDetailPath,
  userOrderDetailPath,
} from '@/features/dashboard/lib/orderLabels';

export const MENTORING_PATH = '/dashboard/mentoring';

export const MENTORING_NAV = 'Mentoring';

export const MENTOR_PROGRAM = {
  nav: MENTORING_NAV,
  listTitle: MENTORING_NAV,
  listDescription:
    'Theo dõi gói học viên đã đăng ký, tiến độ và lịch từng buổi.',
  detailTitle: 'Chi tiết',
  detailEyebrow: 'Mentoring',
  emptyTitle: 'Chưa có mentoring nào',
  emptyHint: 'Sẽ xuất hiện khi học viên thanh toán gói dịch vụ của bạn.',
  filterEmpty: 'Không có mục phù hợp với bộ lọc.',
  progress: 'Tiến độ',
  sessionsCompleted: 'buổi đã hoàn thành',
  sessionList: 'Lịch buổi học',
  sessionEmpty: 'Chưa có buổi học nào được lên lịch.',
  orderSection: 'Thông tin đơn hàng',
  counterparty: 'Học viên',
  chatAction: 'Nhắn tin học viên',
  listPath: MENTORING_PATH,
  orderListPath: '/dashboard/orders',
} as const;

export const USER_PROGRAM = {
  nav: MENTORING_NAV,
  listTitle: MENTORING_NAV,
  listDescription:
    'Theo dõi gói mentoring bạn đã đăng ký, tiến độ và lịch từng buổi.',
  detailTitle: 'Chi tiết',
  detailEyebrow: 'Mentoring',
  emptyTitle: 'Chưa có mentoring nào',
  emptyHint: 'Sẽ xuất hiện sau khi bạn thanh toán gói mentoring.',
  filterEmpty: 'Không có mục phù hợp với bộ lọc.',
  progress: 'Tiến độ',
  sessionsCompleted: 'buổi đã hoàn thành',
  sessionList: 'Lịch buổi học',
  sessionEmpty: 'Chưa có buổi học nào được lên lịch.',
  orderSection: 'Thông tin đơn hàng',
  counterparty: 'Mentor',
  chatAction: 'Nhắn tin mentor',
  listPath: MENTORING_PATH,
  orderListPath: '/dashboard/my-orders',
} as const;

export const ADMIN_PROGRAM = {
  nav: MENTORING_NAV,
  listTitle: MENTORING_NAV,
  listDescription:
    'Giám sát mentoring trên hệ thống: học viên, mentor, thanh toán và trạng thái.',
  detailTitle: 'Chi tiết',
  detailEyebrow: 'Quản trị mentoring',
  emptyTitle: 'Chưa có mentoring nào',
  emptyHint: 'Dữ liệu sẽ hiển thị khi có giao dịch trên hệ thống.',
  filterEmpty: 'Không có mục phù hợp với bộ lọc.',
  progress: 'Tiến độ ước tính',
  sessionsCompleted: 'buổi đã hoàn thành',
  sessionList: 'Lịch buổi học',
  sessionEmpty: 'Chi tiết từng buổi sẽ được bổ sung khi API admin hỗ trợ đầy đủ.',
  orderSection: 'Thông tin giao dịch',
  counterparty: 'Học viên — mentor',
  listPath: MENTORING_PATH,
} as const;

export type ProgramLabels =
  | typeof MENTOR_PROGRAM
  | typeof USER_PROGRAM
  | typeof ADMIN_PROGRAM;

export function programDetailPath(bookingId: string): string {
  return `${MENTORING_PATH}/${bookingId}`;
}

export function programReportPath(bookingId: string): string {
  return `${MENTORING_PATH}/${bookingId}/report`;
}

/** @deprecated Use programDetailPath */
export const mentorProgramDetailPath = programDetailPath;

/** @deprecated Use programDetailPath */
export const userProgramDetailPath = programDetailPath;

/** @deprecated Use programDetailPath */
export const adminProgramDetailPath = programDetailPath;

/** @deprecated Use programReportPath */
export const mentorProgramReportPath = programReportPath;

/** @deprecated Use programReportPath */
export const userProgramReportPath = programReportPath;

export function buildProgramOrderHref(
  labels: ProgramLabels,
  orderId: string | null | undefined,
): string | null {
  if (!orderId || !('orderListPath' in labels)) return null;
  if (labels.orderListPath === '/dashboard/my-orders') return userOrderDetailPath(orderId);
  if (labels.orderListPath === '/dashboard/orders') return mentorOrderDetailPath(orderId);
  return null;
}

export function buildProgramReportHref(labels: ProgramLabels, bookingId: string): string | null {
  if (!('orderListPath' in labels)) return null;
  return programReportPath(bookingId);
}
