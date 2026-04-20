'use client';

import React from 'react';
import type { SessionDisputePhase, SessionDisputeStage } from '@/types';
import { cn } from '@/lib/utils';

const PHASE_ORDER: SessionDisputePhase[] = ['submitted', 'evidence', 'admin_review', 'decision', 'closed'];

type Props = {
  stages: SessionDisputeStage[];
  currentPhase: SessionDisputePhase;
  /** Nền tối (khối slate-900) — chỉnh màu chữ/connector */
  variant?: 'light' | 'dark';
};

export function DisputeProcessStepper({ stages, currentPhase, variant = 'light' }: Props) {
  const dark = variant === 'dark';
  const byPhase = Object.fromEntries(stages.map((s) => [s.phase, s])) as Record<SessionDisputePhase, SessionDisputeStage>;
  const idxCur = PHASE_ORDER.indexOf(currentPhase);

  return (
    <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600/80 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-800/40">
      <div className="flex min-w-[min(100%,720px)] items-start pb-1 pt-0.5">
        {PHASE_ORDER.map((phase, index) => {
          const s = byPhase[phase];
          const label = s?.label ?? phase;
          const done = Boolean(s?.done);
          const isCurrent = phase === currentPhase && !done;
            const isFuture = !done && index > idxCur;

          const circle = cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
            done && 'bg-primary text-white ring-2 ring-primary/35',
            isCurrent && 'bg-white text-slate-900 ring-2 ring-primary shadow-[0_0_0_4px_rgba(20,110,245,0.12)]',
            isFuture && dark && 'border-2 border-slate-500 bg-slate-900 text-slate-500',
            isFuture && !dark && 'border-2 border-slate-600 bg-slate-900 text-slate-500',
            !done && !isCurrent && !isFuture && (dark ? 'bg-slate-600 text-slate-100' : 'bg-slate-700 text-slate-200'),
          );

          const mark = done ? '✓' : index + 1;

          const connectorDone = index < PHASE_ORDER.length - 1 && PHASE_ORDER[index] && byPhase[PHASE_ORDER[index]]?.done;

          const line =
            index < PHASE_ORDER.length - 1 ? (
              <div
                className={cn(
                  'mx-1 h-0.5 min-w-[1.25rem] flex-1 self-center rounded-full',
                  connectorDone ? 'bg-primary/70' : dark ? 'bg-slate-600' : 'bg-slate-700',
                )}
                aria-hidden
              />
            ) : null;

          return (
            <React.Fragment key={phase}>
              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <div className={circle}>{mark}</div>
                <p
                  className={cn(
                    'mt-2 max-w-[9.5rem] text-[11px] font-semibold leading-snug sm:text-xs',
                    isCurrent && 'text-primary',
                    done && (dark ? 'text-slate-200' : 'text-slate-700'),
                    isFuture && (dark ? 'text-slate-500' : 'text-slate-500'),
                    !done && !isCurrent && !isFuture && (dark ? 'text-slate-300' : 'text-slate-300'),
                  )}
                >
                  {label}
                </p>
                {s?.completedAt ? (
                  <p className={cn('mt-0.5 hidden text-[10px] sm:block', dark ? 'text-slate-500' : 'text-slate-500')}>
                    {s.completedAt}
                  </p>
                ) : null}
              </div>
              {line}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
