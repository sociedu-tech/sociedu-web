'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import type { ChatMessageContext } from '@/features/dashboard/chat/types';
import {
  contextTypeLabel,
  fetchMessageContextSummary,
  getCachedMessageContextSummary,
  type MessageContextSummary,
} from '@/features/dashboard/chat/messageContextSummary';
import { cn } from '@/lib/utils';
import { ROLES } from '@/constants/roles';
import { useAuth } from '@/context/AuthContext';

type ChatMessageContextBoxProps = {
  context: ChatMessageContext;
  variant: 'me' | 'them';
};

export function ChatMessageContextBox({ context, variant }: ChatMessageContextBoxProps) {
  const { hasRole } = useAuth();
  const isMentor = hasRole(ROLES.MENTOR);
  const cached = getCachedMessageContextSummary(context);
  const [summary, setSummary] = useState<MessageContextSummary | null>(cached ?? null);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) return;
    let cancelled = false;
    setLoading(true);
    void fetchMessageContextSummary(context, isMentor)
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {
        if (!cancelled) {
          setSummary({
            title: 'Gói dịch vụ',
            subtitle: contextTypeLabel(context.contextType),
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [cached, context.contextId, context.contextType, isMentor]);

  const body = (
    <div className="min-w-0 flex-1 overflow-hidden">
      <p
        className={cn(
          'text-[10px] font-semibold uppercase tracking-wide',
          variant === 'me' ? 'text-white/70' : 'text-slate-500',
        )}
      >
        {contextTypeLabel(context.contextType)}
      </p>
      {loading ? (
        <div className="mt-1 flex items-center gap-1.5 text-xs opacity-80">
          <Loader2 className="size-3 shrink-0 animate-spin" />
          <span>Đang tải…</span>
        </div>
      ) : (
        <>
          <p
            className={cn(
              'mt-0.5 break-words text-sm font-semibold leading-snug sm:text-[13px]',
              variant === 'me' ? 'text-white' : 'text-slate-900',
            )}
          >
            {summary?.title}
          </p>
          {summary?.subtitle ? (
            <p
              className={cn(
                'mt-0.5 break-words text-xs leading-snug',
                variant === 'me' ? 'text-white/85' : 'text-slate-500',
              )}
            >
              {summary.subtitle}
            </p>
          ) : null}
        </>
      )}
    </div>
  );

  const shellClass = cn(
    'mb-2 flex w-full min-w-0 items-start gap-2 rounded-xl border px-2.5 py-2 sm:px-3 sm:py-2.5',
    variant === 'me' ? 'border-white/25 bg-white/10' : 'border-slate-200 bg-slate-50',
  );

  if (summary?.href && !loading) {
    return (
      <Link href={summary.href} className={cn(shellClass, 'transition-opacity hover:opacity-90')}>
        {body}
        <ExternalLink
          className={cn('mt-0.5 size-3.5 shrink-0', variant === 'me' ? 'text-white/70' : 'text-slate-400')}
          strokeWidth={2}
          aria-hidden
        />
      </Link>
    );
  }

  return <div className={shellClass}>{body}</div>;
}
