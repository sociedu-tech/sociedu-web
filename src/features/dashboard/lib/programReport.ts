import { trustService } from '@/services/trustService';

export type ProgramReportTargetType = 'booking' | 'session';

export const PROGRAM_REPORT_REASONS: { value: string; label: string }[] = [
  { value: 'no_show', label: 'Vắng mặt / Không tham dự' },
  { value: 'quality', label: 'Chất lượng không đạt yêu cầu' },
  { value: 'harassment', label: 'Quấy rối / Hành vi không phù hợp' },
  { value: 'fraud', label: 'Gian lận / Lừa đảo' },
  { value: 'schedule', label: 'Tranh chấp lịch học' },
  { value: 'other', label: 'Lý do khác' },
];

export function programReportReasonLabel(value: string): string {
  return PROGRAM_REPORT_REASONS.find((r) => r.value === value)?.label ?? value;
}

export type SubmitProgramReportInput = {
  type: ProgramReportTargetType;
  entityId: string;
  reportedUserId?: string | null;
  reasonValue: string;
  description: string;
};

export async function submitProgramReport(input: SubmitProgramReportInput): Promise<void> {
  const reason = programReportReasonLabel(input.reasonValue);
  const description = input.description.trim();

  if (!input.entityId.trim()) {
    throw new Error('Không xác định được đối tượng báo cáo.');
  }
  if (!description) {
    throw new Error('Vui lòng mô tả chi tiết vấn đề.');
  }

  await trustService.createReport({
    type: input.type,
    entityId: input.entityId,
    reportedUserId: input.reportedUserId || undefined,
    reason,
    description,
  });
}

export function programReportTargetTitle(
  type: ProgramReportTargetType,
  label: string,
): string {
  if (type === 'booking') return `Lộ trình: ${label}`;
  return `Buổi học: ${label}`;
}
