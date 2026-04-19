'use client';

import React, { useEffect, useState } from 'react';
import { Check, Sparkles, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  loadInitialDemoOffers,
  saveDemoOffers,
  type DemoMentorOffer,
} from '@/views/dashboard/projects/projectOfferDemoStorage';

/** Đề xuất lộ trình + giá từ mentor — học viên chấp nhận / từ chối (demo + sessionStorage). */
export function MenteeIncomingOffers() {
  const [rows, setRows] = useState<DemoMentorOffer[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRows(loadInitialDemoOffers());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    saveDemoOffers(rows);
  }, [rows, mounted]);

  const pending = rows.filter((r) => r.status === 'pending');
  if (!mounted || pending.length === 0) return null;

  const setStatus = (id: string, status: 'accepted' | 'declined') => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="glass-card overflow-hidden border-indigo-100/80 bg-linear-to-br from-indigo-50/50 to-white">
      <div className="flex items-center gap-2 border-b border-indigo-100/80 px-4 py-3 sm:px-5">
        <Sparkles className="size-5 text-indigo-600" strokeWidth={2} />
        <h2 className="text-sm font-semibold text-slate-900">Đề xuất từ mentor</h2>
        <span className="ml-auto rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800">
          {pending.length}
        </span>
      </div>
      <ul className="divide-y divide-slate-100">
        {pending.map((o) => (
          <li key={o.id} className="px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 space-y-2">
                <p className="font-semibold text-slate-900">{o.projectTitle}</p>
                <p className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                  <User className="size-4 shrink-0 text-slate-400" strokeWidth={2} />
                  {o.mentorName}
                </p>
                <p className="text-sm leading-relaxed text-slate-700">{o.roadmap}</p>
                <p className="text-sm font-medium text-slate-900">
                  {o.priceVnd.toLocaleString('vi-VN')}đ · {o.weeks} tuần
                </p>
              </div>
              <div className="flex shrink-0 gap-2 lg:flex-col">
                <button
                  type="button"
                  onClick={() => setStatus(o.id, 'accepted')}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 lg:flex-none"
                >
                  <Check className="size-4" strokeWidth={2.5} />
                  Chấp nhận
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(o.id, 'declined')}
                  className={cn(
                    'inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 lg:flex-none',
                  )}
                >
                  <X className="size-4" strokeWidth={2} />
                  Từ chối
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
