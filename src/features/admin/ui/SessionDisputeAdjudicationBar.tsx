'use client';

import React from 'react';
import type { SessionDisputePhase } from '@/types';
import { adminBtnGhost, adminBtnPrimary } from '@/features/admin/ui/adminClasses';
import { cn } from '@/lib/utils';

type Props = {
  currentPhase: SessionDisputePhase | undefined;
  /** Đã đóng hồ sơ (giai đoạn closed hoàn tất) */
  isClosed: boolean;
  advanceFromEvidence: () => void;
  advanceToDecision: () => void;
  applyRuling: (kind: 'favor_learner' | 'favor_mentor' | 'dismiss') => void;
  requestMoreEvidence: () => void;
};

export function SessionDisputeAdjudicationBar({
  currentPhase,
  isClosed,
  advanceFromEvidence,
  advanceToDecision,
  applyRuling,
  requestMoreEvidence,
}: Props) {
  if (isClosed) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Hồ sơ tranh chấp đã <strong className="text-slate-900">đóng</strong>. Muốn mô phỏng lại: tải lại trang (trạng thái demo reset theo dữ liệu mẫu).
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phân xử (demo)</p>
        <p className="mt-1 text-sm text-slate-600">
          Các nút cập nhật giai đoạn &amp; kết luận trên trình duyệt. Kết nối API sẽ gọi endpoint thật và ghi audit log.
        </p>
      </div>

      {currentPhase === 'evidence' ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={advanceFromEvidence} className={cn(adminBtnPrimary, 'px-4 py-2.5')}>
            Chốt minh chứng → Đối chiếu admin
          </button>
          <button type="button" onClick={requestMoreEvidence} className={cn(adminBtnGhost, 'px-4 py-2.5')}>
            Yêu cầu bổ sung minh chứng
          </button>
        </div>
      ) : null}

      {currentPhase === 'admin_review' ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={advanceToDecision} className={cn(adminBtnPrimary, 'px-4 py-2.5')}>
            Hoàn tất đối chiếu → Ra quyết định
          </button>
          <button type="button" onClick={requestMoreEvidence} className={cn(adminBtnGhost, 'px-4 py-2.5')}>
            Quay lại thu thập minh chứng
          </button>
        </div>
      ) : null}

      {currentPhase === 'decision' ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-700">Chọn hướng xử lý:</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => applyRuling('favor_learner')} className={cn(adminBtnPrimary, 'px-4 py-2.5')}>
              Chấp nhận khiếu nại học viên
            </button>
            <button type="button" onClick={() => applyRuling('favor_mentor')} className={cn(adminBtnPrimary, 'px-4 py-2.5')}>
              Bác khiếu nại (ủng hộ mentor)
            </button>
            <button type="button" onClick={() => applyRuling('dismiss')} className={cn(adminBtnGhost, 'px-4 py-2.5')}>
              Bác đơn (không đủ căn cứ)
            </button>
          </div>
        </div>
      ) : null}

      {currentPhase === 'submitted' ? (
        <p className="text-sm text-slate-500">
          Đang ở bước tiếp nhận — trong demo, chuyển thẳng sang thu thập minh chứng bằng dữ liệu mẫu hoặc chờ API đồng bộ.
        </p>
      ) : null}
    </div>
  );
}
