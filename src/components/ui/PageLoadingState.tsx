'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';
import { LoadingSkeleton } from './LoadingSkeleton';

export type PageLoadingVariant = 'spinner' | 'table' | 'cards' | 'stats' | 'chat';

type PageLoadingStateProps = {
  label?: string;
  className?: string;
  /** Tailwind min-height utility or arbitrary value */
  minHeight?: string;
  variant?: PageLoadingVariant;
  /** Used when variant is cards */
  cardCount?: number;
};

export function PageLoadingState({
  label = 'Đang tải…',
  className,
  minHeight = 'min-h-[40vh]',
  variant = 'spinner',
  cardCount = 4,
}: PageLoadingStateProps) {
  return (
    <div
      className={cn('flex w-full items-center justify-center', minHeight, className)}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      {variant === 'spinner' ? (
        <LoadingSpinner label={label} />
      ) : variant === 'table' ? (
        <LoadingSkeleton.Table rows={6} label={label} />
      ) : variant === 'cards' ? (
        <LoadingSkeleton.Cards count={cardCount} label={label} />
      ) : variant === 'stats' ? (
        <LoadingSkeleton.Stats label={label} />
      ) : variant === 'chat' ? (
        <LoadingSkeleton.Chat label={label} />
      ) : null}
    </div>
  );
}
