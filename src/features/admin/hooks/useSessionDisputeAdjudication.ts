import { useCallback, useEffect, useState } from 'react';
import type { AdminModerationReport, SessionDisputeDetail, SessionDisputePhase } from '@/types';

function nowVi() {
  return new Date().toLocaleString('vi-VN', { hour12: false });
}

function patchStage(d: SessionDisputeDetail, phase: SessionDisputePhase, done: boolean): SessionDisputeDetail {
  return {
    ...d,
    stages: d.stages.map((s) =>
      s.phase === phase
        ? { ...s, done, completedAt: done ? (s.completedAt ?? nowVi()) : undefined }
        : s,
    ),
  };
}

type Props = {
  initialReport: AdminModerationReport;
  onReportMetaChange?: (patch: Pick<AdminModerationReport, 'status'>) => void;
};

export function useSessionDisputeAdjudication({ initialReport, onReportMetaChange }: Props) {
  const [dispute, setDispute] = useState<SessionDisputeDetail | null>(initialReport.sessionDispute ?? null);

  useEffect(() => {
    setDispute(initialReport.sessionDispute ?? null);
  }, [initialReport.id]);

  const canAct = Boolean(dispute && initialReport.targetType === 'session');
  const currentPhase = dispute?.currentPhase;

  const advanceFromEvidence = useCallback(() => {
    setDispute((d) => {
      if (!d || d.currentPhase !== 'evidence') return d;
      const next = patchStage(d, 'evidence', true);
      return { ...next, currentPhase: 'admin_review' as const };
    });
    onReportMetaChange?.({ status: 'in_review' });
  }, [onReportMetaChange]);

  const advanceToDecision = useCallback(() => {
    setDispute((d) => {
      if (!d || d.currentPhase !== 'admin_review') return d;
      const next = patchStage(d, 'admin_review', true);
      return { ...next, currentPhase: 'decision' as const };
    });
  }, []);

  const applyRuling = useCallback(
    (kind: 'favor_learner' | 'favor_mentor' | 'dismiss') => {
      setDispute((d) => {
        if (!d || d.currentPhase !== 'decision') return d;
        const note =
          kind === 'favor_learner'
            ? 'Quyết định: chấp nhận khiếu nại học viên — hoàn một phần / bù buổi theo chính sách (demo).'
            : kind === 'favor_mentor'
              ? 'Quyết định: bác khiếu nại — giữ thanh toán cho mentor; khuyến nghị ghi nhận nếu lặp lại (demo).'
              : 'Quyết định: bác đơn — không đủ căn cứ; khuyến nghị hai bên thống nhất biên bản trước buổi sau (demo).';
        let next = patchStage(d, 'decision', true);
        next = patchStage(next, 'closed', true);
        return { ...next, currentPhase: 'closed' as const, adminResolutionNote: note };
      });
      onReportMetaChange?.({ status: kind === 'dismiss' ? 'dismissed' : 'resolved' });
    },
    [onReportMetaChange],
  );

  const requestMoreEvidence = useCallback(() => {
    setDispute((d) => {
      if (!d) return d;
      let next = patchStage(d, 'admin_review', false);
      next = patchStage(next, 'evidence', false);
      return { ...next, currentPhase: 'evidence' };
    });
  }, []);

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
