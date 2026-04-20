'use client';

import React from 'react';
import { Gavel, Paperclip, Scale } from 'lucide-react';
import type { SessionDisputeDetail, SessionDisputeParty } from '@/types';
import { cn } from '@/lib/utils';

function partyLabel(p: SessionDisputeParty) {
  switch (p) {
    case 'learner':
      return 'Học viên';
    case 'mentor':
      return 'Mentor';
    case 'admin':
      return 'Admin';
  }
}

type Props = { detail: SessionDisputeDetail; className?: string; /** Ẩn danh sách giai đoạn khi đã có stepper ngang */ showStageList?: boolean };

export function SessionDisputePanel({ detail: d, className, showStageList = true }: Props) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <Scale className="size-3.5 shrink-0 text-primary" aria-hidden />
        <span>
          Mã buổi: <strong className="font-mono text-slate-900">{d.sessionCode}</strong>
        </span>
        <span className="text-slate-300">·</span>
        <span>Lịch: {d.sessionAt}</span>
        <span className="text-slate-300">·</span>
        <span>
          {d.menteeName} ↔ {d.mentorName}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Lý do / tường trình — {partyLabel(d.openedByParty)} (mở khiếu nại)
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-800">{d.openerStatement}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Phản hồi phía còn lại</p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-800">{d.counterStatement}</p>
        </div>
      </div>

      {showStageList ? (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <Gavel className="size-3.5 text-primary" aria-hidden />
            Giai đoạn xử lý (admin)
          </p>
          <ol className="space-y-2">
            {d.stages.map((s) => {
              const active = s.phase === d.currentPhase && !s.done;
              return (
                <li
                  key={s.phase}
                  className={cn(
                    'flex gap-3 rounded-xl border px-3 py-2.5 text-sm',
                    s.done
                      ? 'border-slate-200 bg-white'
                      : active
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-dashed border-slate-200 bg-slate-50/50 text-slate-500',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                      s.done ? 'bg-primary text-white' : active ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600',
                    )}
                    aria-hidden
                  >
                    {s.done ? '✓' : '…'}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{s.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{s.description}</p>
                    {s.completedAt ? (
                      <p className="mt-1 text-[11px] text-slate-500">Hoàn thành: {s.completedAt}</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-800">
          <Paperclip className="size-3.5 text-primary" aria-hidden />
          Minh chứng các bên đã gửi
        </p>
        {d.evidence.length === 0 ? (
          <p className="text-xs text-slate-500">Chưa có file đính kèm.</p>
        ) : (
          <ul className="space-y-2">
            {d.evidence.map((e) => (
              <li
                key={e.id}
                className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700 ring-1 ring-slate-200">
                    {partyLabel(e.party)}
                  </span>
                  <p className="mt-1 font-medium text-slate-900">{e.title}</p>
                  <p className="text-xs leading-relaxed text-slate-600">{e.detail}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{e.uploadedAt}</p>
                </div>
                {e.fileLabel ? (
                  <span className="shrink-0 font-mono text-[11px] text-primary">{e.fileLabel}</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      {d.adminResolutionNote ? (
        <div className="rounded-xl border border-primary/25 bg-primary/5 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">Kết luận admin</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-800">{d.adminResolutionNote}</p>
        </div>
      ) : null}
    </div>
  );
}
