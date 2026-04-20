'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BadgePercent,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Inbox,
  Layers,
  MapIcon,
  MessageCircle,
  Send,
  Sparkles,
  User,
} from 'lucide-react';
import { DashboardCard } from '@/features/dashboard/ui/DashboardPrimitives';
import {
  formatVnd,
  initials,
  useMentorProjectOpportunitiesPage,
  type MentorOffer,
  type MentorOpportunityTabId,
} from '@/features/dashboard/hooks';
import { type StudentRequest, type SuggestedProject } from '@/data/mentorOpportunitiesMock';
import { cn } from '@/lib/utils';

export function MentorProjectOpportunitiesPage() {
  const {
    offers,
    openFormId,
    setOpenFormId,
    tab,
    onTabChange,
    updateDraft,
    sendOffer,
    getDraft,
    pendingSuggested,
    pendingRequests,
    sentItems,
  } = useMentorProjectOpportunitiesPage();

  const renderOfferForm = (projectId: string) => {
    const d = getDraft(projectId);
    return (
      <div className="mt-6 border-t border-slate-100 pt-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-800">
              Lộ trình đề xuất <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              placeholder="Ví dụ: Tuần 1–2: kiến trúc và spike; Tuần 3–4: API và auth; …"
              value={d.roadmap}
              onChange={(e) => updateDraft(projectId, 'roadmap', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-800">
                Giá đề xuất (VND) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BadgePercent className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="4.500.000"
                  value={d.price}
                  onChange={(e) => updateDraft(projectId, 'price', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-800">
                Thời lượng ước tính (tuần)
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min={1}
                  value={d.weeks}
                  onChange={(e) => updateDraft(projectId, 'weeks', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Học viên nhận đề xuất tại mục <strong className="font-medium text-slate-700">Dự án</strong> (demo).
            </p>
            <button
              type="button"
              onClick={() => sendOffer(projectId)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 sm:w-auto sm:px-8"
            >
              <MapIcon className="size-4" strokeWidth={2} />
              Gửi đề xuất cho học viên
            </button>
          </div>
        </div>
      </div>
    );
  };

  const tabs: { id: MentorOpportunityTabId; label: string; count: number; icon: typeof Sparkles }[] = [
    { id: 'suggested', label: 'Gợi ý', count: pendingSuggested.length, icon: Sparkles },
    { id: 'requests', label: 'Yêu cầu', count: pendingRequests.length, icon: Inbox },
    { id: 'sent', label: 'Đã gửi', count: sentItems.length, icon: Layers },
  ];

  return (
    <div className="pb-12">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="size-4" strokeWidth={2} />
          Tổng quan
        </Link>

        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-linear-to-br from-slate-50 via-white to-indigo-50/30 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pipeline</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[26px]">
                Cơ hội dự án
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                Theo dõi gợi ý khớp chuyên môn và yêu cầu trực tiếp từ học viên — phản hồi bằng lộ trình và báo giá.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-white/80 bg-white/90 p-3 shadow-sm ring-1 ring-slate-100">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">Gợi ý mở</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{pendingSuggested.length}</p>
            </div>
            <div className="rounded-xl border border-white/80 bg-white/90 p-3 shadow-sm ring-1 ring-slate-100">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Yêu cầu</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{pendingRequests.length}</p>
            </div>
            <div className="rounded-xl border border-white/80 bg-white/90 p-3 shadow-sm ring-1 ring-slate-100">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Chờ phản hồi</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{sentItems.length}</p>
            </div>
            <div className="rounded-xl border border-white/80 bg-white/90 p-3 shadow-sm ring-1 ring-slate-100">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Cần xử lý</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
                {pendingSuggested.length + pendingRequests.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-1.5"
        role="tablist"
        aria-label="Phân loại cơ hội"
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(t.id)}
              className={cn(
                'inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition min-w-[8rem] sm:min-w-0 sm:flex-none',
                active
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900',
              )}
            >
              <Icon className="size-4 shrink-0 opacity-80" strokeWidth={2} />
              {t.label}
              <span
                className={cn(
                  'min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-xs font-bold tabular-nums',
                  active ? 'bg-slate-900 text-white' : 'bg-slate-200/80 text-slate-700',
                )}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="min-h-[200px]">
        {tab === 'sent' ? (
          <div className="space-y-3">
            {sentItems.length === 0 ? (
              <DashboardCard>
                <p className="text-center text-sm text-slate-600">Chưa có đề xuất nào đã gửi.</p>
              </DashboardCard>
            ) : (
              sentItems.map((p) => {
                const o = offers[p.id]!;
                return (
                  <DashboardCard key={p.id} className="border-emerald-100/80 bg-emerald-50/25">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{p.title}</p>
                        <p className="mt-0.5 text-sm text-slate-600">
                          {formatVnd(o.priceVnd)} · {o.durationWeeks} tuần
                        </p>
                      </div>
                      <span className="inline-flex w-fit items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-amber-900 ring-1 ring-amber-200">
                        Chờ học viên phản hồi
                      </span>
                    </div>
                  </DashboardCard>
                );
              })
            )}
          </div>
        ) : null}

        {tab === 'suggested' ? (
          <OpportunityListSuggested
            items={pendingSuggested}
            offers={offers}
            openFormId={openFormId}
            setOpenFormId={setOpenFormId}
            renderOfferForm={renderOfferForm}
          />
        ) : null}

        {tab === 'requests' ? (
          <OpportunityListRequests
            items={pendingRequests}
            offers={offers}
            openFormId={openFormId}
            setOpenFormId={setOpenFormId}
            renderOfferForm={renderOfferForm}
          />
        ) : null}
      </div>
    </div>
  );
}

function OpportunityListSuggested({
  items,
  offers,
  openFormId,
  setOpenFormId,
  renderOfferForm,
}: {
  items: SuggestedProject[];
  offers: Record<string, MentorOffer>;
  openFormId: string | null;
  setOpenFormId: (id: string | null) => void;
  renderOfferForm: (id: string) => React.ReactNode;
}) {
  if (items.length === 0) {
    return (
      <DashboardCard>
        <p className="text-center text-sm text-slate-600">Không còn gợi ý mở trong tab này.</p>
      </DashboardCard>
    );
  }
  return (
    <div className="space-y-4">
      {items.map((p) => {
        const expanded = openFormId === p.id;
        const sent = offers[p.id]?.status === 'sent';
        return (
          <DashboardCard
            key={p.id}
            padding
            className="overflow-hidden border-slate-200/90 border-l-4 border-l-indigo-500"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 gap-4">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-800"
                  aria-hidden
                >
                  {initials(p.menteeName)}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-800">
                      {p.matchPercent}% khớp
                    </span>
                    <span className="text-xs text-slate-500">{p.postedAt}</span>
                  </div>
                  <h3 className="text-base font-semibold leading-snug text-slate-900">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{p.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <User className="size-3.5" strokeWidth={2} />
                      {p.menteeName}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" strokeWidth={2} />
                      {p.durationLabel}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={sent}
                onClick={() => setOpenFormId(expanded ? null : p.id)}
                className={cn(
                  'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition',
                  sent
                    ? 'cursor-not-allowed border border-slate-200 bg-slate-50 text-slate-400'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700',
                )}
              >
                {sent ? (
                  <>
                    <Check className="size-4" strokeWidth={2.5} />
                    Đã gửi
                  </>
                ) : (
                  <>
                    <Send className="size-4" strokeWidth={2} />
                    Gửi đề xuất
                    {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </>
                )}
              </button>
            </div>
            {expanded && !sent ? renderOfferForm(p.id) : null}
          </DashboardCard>
        );
      })}
    </div>
  );
}

function OpportunityListRequests({
  items,
  offers,
  openFormId,
  setOpenFormId,
  renderOfferForm,
}: {
  items: StudentRequest[];
  offers: Record<string, MentorOffer>;
  openFormId: string | null;
  setOpenFormId: (id: string | null) => void;
  renderOfferForm: (id: string) => React.ReactNode;
}) {
  if (items.length === 0) {
    return (
      <DashboardCard>
        <p className="text-center text-sm text-slate-600">Chưa có yêu cầu mới từ học viên.</p>
      </DashboardCard>
    );
  }
  return (
    <div className="space-y-4">
      {items.map((p) => {
        const expanded = openFormId === p.id;
        const sent = offers[p.id]?.status === 'sent';
        return (
          <DashboardCard
            key={p.id}
            padding
            className="overflow-hidden border-amber-100/90 border-l-4 border-l-amber-500 bg-amber-50/15"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 gap-4">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-sm font-bold text-amber-900"
                  aria-hidden
                >
                  {initials(p.menteeName)}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900">
                      Yêu cầu trực tiếp
                    </span>
                    <span className="text-xs text-slate-500">{p.postedAt}</span>
                  </div>
                  <h3 className="text-base font-semibold leading-snug text-slate-900">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{p.summary}</p>
                  <div className="rounded-xl border border-amber-200/70 bg-white/90 px-3 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                      <MessageCircle className="size-3.5 text-amber-700" strokeWidth={2} />
                      Lời nhắn
                    </span>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-800">{p.menteeMessage}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-amber-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <User className="size-3.5" strokeWidth={2} />
                      {p.menteeName}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" strokeWidth={2} />
                      {p.durationLabel}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={sent}
                onClick={() => setOpenFormId(expanded ? null : p.id)}
                className={cn(
                  'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition',
                  sent
                    ? 'cursor-not-allowed border border-slate-200 bg-slate-50 text-slate-400'
                    : 'bg-amber-700 text-white hover:bg-amber-800',
                )}
              >
                {sent ? (
                  <>
                    <Check className="size-4" strokeWidth={2.5} />
                    Đã gửi
                  </>
                ) : (
                  <>
                    <Send className="size-4" strokeWidth={2} />
                    Trả lời
                    {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </>
                )}
              </button>
            </div>
            {expanded && !sent ? renderOfferForm(p.id) : null}
          </DashboardCard>
        );
      })}
    </div>
  );
}
