import type { SessionReportRequestStatus } from '@/services/sessionReportService';

export const SESSION_REPORT_STATUS_LABEL: Record<SessionReportRequestStatus, string> = {
  PENDING_SUBMISSION: 'Chờ nộp báo cáo',
  SUBMITTED: 'Đã nộp — chờ duyệt',
  APPROVED: 'Đã thông qua',
  REJECTED: 'Cần sửa đổi',
};

export const SESSION_REPORT_STATUS_CLASS: Record<SessionReportRequestStatus, string> = {
  PENDING_SUBMISSION: 'bg-amber-50 text-amber-800 border-amber-200',
  SUBMITTED: 'bg-blue-50 text-blue-800 border-blue-200',
  APPROVED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-800 border-rose-200',
};

export function formatSessionReportDate(value?: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleString('vi-VN');
}
