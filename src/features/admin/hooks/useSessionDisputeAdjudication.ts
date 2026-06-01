import { useCallback, useEffect, useState } from 'react';
import type { AdminModerationReport, SessionDisputeDetail, SessionDisputePhase } from '@/types';
import { adminModerationService } from '@/services/adminModerationService';

type Props = {
  initialReport: AdminModerationReport;
  onReportMetaChange?: (patch: Pick<AdminModerationReport, 'status'>) => void;
  onRefresh?: () => void;
};

export function useSessionDisputeAdjudication({ initialReport, onReportMetaChange, onRefresh }: Props) {
  const [dispute, setDispute] = useState<SessionDisputeDetail | null>(initialReport.sessionDispute ?? null);
  const [phaseOverride, setPhaseOverride] = useState<SessionDisputePhase | null>(null);

  useEffect(() => {
    setDispute(initialReport.sessionDispute ?? null);
    setPhaseOverride(null);
  }, [initialReport.id, initialReport.sessionDispute]);

  const canAct = Boolean(dispute && initialReport.targetType === 'session');
  const currentPhase = phaseOverride || dispute?.currentPhase;

  const advanceFromEvidence = useCallback(async () => {
    try {
      await adminModerationService.resolve(initialReport.id, { status: 'in_review' });
      onReportMetaChange?.({ status: 'in_review' });
      onRefresh?.();
    } catch (err) {
      console.error('Lỗi khi tiếp quản xử lý tranh chấp:', err);
    }
  }, [initialReport.id, onReportMetaChange, onRefresh]);

  const advanceToDecision = useCallback(() => {
    setPhaseOverride('decision');
  }, []);

  const applyRuling = useCallback(
    async (kind: 'favor_learner' | 'favor_mentor' | 'dismiss') => {
      const note =
        kind === 'favor_learner'
          ? 'Quyết định: chấp nhận khiếu nại học viên — hoàn một phần / bù buổi theo chính sách.'
          : kind === 'favor_mentor'
            ? 'Quyết định: bác khiếu nại — giữ thanh toán cho mentor.'
            : 'Quyết định: bác đơn — không đủ căn cứ.';
      const nextStatus = kind === 'dismiss' ? 'dismissed' : 'resolved';
      try {
        await adminModerationService.resolve(initialReport.id, { status: nextStatus, resolutionNote: note });
        onReportMetaChange?.({ status: nextStatus });
        onRefresh?.();
      } catch (err) {
        console.error('Lỗi khi đưa ra phán quyết:', err);
      }
    },
    [initialReport.id, onReportMetaChange, onRefresh],
  );

  const requestMoreEvidence = useCallback(async () => {
    try {
      await adminModerationService.resolve(initialReport.id, { status: 'open' });
      onReportMetaChange?.({ status: 'open' });
      onRefresh?.();
    } catch (err) {
      console.error('Lỗi khi yêu cầu thêm minh chứng:', err);
    }
  }, [initialReport.id, onReportMetaChange, onRefresh]);

  return {
    dispute,
    canAct,
    currentPhase,
    advanceFromEvidence,
    advanceToDecision,
    applyRuling,
    requestMoreEvidence,
  };
}
