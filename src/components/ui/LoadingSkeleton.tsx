'use client';

import React from 'react';
import { cn } from '@/lib/utils';

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200/80', className)} aria-hidden />;
}

function SkeletonLabel({ label }: { label?: string }) {
  if (!label) return null;
  return <p className="sr-only">{label}</p>;
}

function TableSkeleton({ rows = 6, label }: { rows?: number; label?: string }) {
  return (
    <div className="w-full max-w-5xl space-y-3 px-2">
      <SkeletonLabel label={label} />
      <SkeletonBlock className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBlock key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

function CardsSkeleton({ count = 4, label }: { count?: number; label?: string }) {
  return (
    <div className="grid w-full max-w-5xl gap-4 px-2 sm:grid-cols-2">
      <SkeletonLabel label={label} />
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5">
          <SkeletonBlock className="h-5 w-2/3" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-4/5" />
          <SkeletonBlock className="h-9 w-28" />
        </div>
      ))}
    </div>
  );
}

function StatsSkeleton({ label }: { label?: string }) {
  return (
    <div className="w-full max-w-5xl space-y-4 px-2">
      <SkeletonLabel label={label} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
      <SkeletonBlock className="h-64 w-full rounded-2xl" />
    </div>
  );
}

function ChatSkeleton({ label }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[420px] w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white">
      <SkeletonLabel label={label} />
      <div className="hidden w-72 shrink-0 space-y-3 border-r border-slate-200 p-3 sm:block">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <SkeletonBlock className="size-11 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-3 w-3/4" />
              <SkeletonBlock className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col">
        <SkeletonBlock className="h-14 w-full rounded-none" />
        <div className="flex flex-1 flex-col justify-end gap-3 p-4">
          <SkeletonBlock className="ml-auto h-10 w-2/5 rounded-2xl" />
          <SkeletonBlock className="h-10 w-1/2 rounded-2xl" />
          <SkeletonBlock className="ml-auto h-10 w-1/3 rounded-2xl" />
        </div>
        <SkeletonBlock className="h-16 w-full rounded-none" />
      </div>
    </div>
  );
}

export const LoadingSkeleton = {
  Table: TableSkeleton,
  Cards: CardsSkeleton,
  Stats: StatsSkeleton,
  Chat: ChatSkeleton,
};
