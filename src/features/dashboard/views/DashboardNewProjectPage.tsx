'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  Lightbulb,
  Loader2,
  Send,
  Sparkles,
  Star,
  Target,
  Users,
} from 'lucide-react';
import { DashboardCard } from '@/features/dashboard/ui/DashboardPrimitives';
import { useDashboardNewProjectPage } from '@/features/dashboard/hooks';
import { cn } from '@/lib/utils';

export function DashboardNewProjectPage() {
  const {
    isMentee,
    title,
    setTitle,
    description,
    setDescription,
    goals,
    setGoals,
    duration,
    setDuration,
    selectedTags,
    topicTags,
    durationOptions,
    mentorsLoading,
    mentorsError,
    submitting,
    submitError,
    onSubmit,
    toggleTag,
    topSuggestions,
  } = useDashboardNewProjectPage();

  if (!isMentee) {
    return (
      <div className="mx-auto max-w-lg px-1 py-8">
        <DashboardCard>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <Users className="size-6" strokeWidth={1.75} />
            </div>
            <h1 className="text-lg font-semibold text-slate-900">Trang dành cho học viên</h1>
            <p className="text-[15px] leading-relaxed text-slate-600">
              Tạo dự án và nhận gợi ý mentor chỉ khả dụng với tài khoản học viên.
            </p>
            <Link
              href="/dashboard"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Về tổng quan
            </Link>
          </div>
        </DashboardCard>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/dashboard/projects"
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="size-4" strokeWidth={2} />
            Quay lại danh sách dự án
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Tạo dự án mới</h1>
          <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-slate-600">
            Mô tả ngắn mục tiêu và lĩnh vực — hệ thống gợi ý mentor phù hợp để bạn bắt đầu nhanh.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
        <form onSubmit={onSubmit} className="min-w-0 space-y-6">
          <DashboardCard>
            <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <Target className="size-5" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Thông tin dự án</h2>
                <p className="mt-0.5 text-sm text-slate-600">
                  Tên và mô tả giúp mentor hiểu bạn cần gì.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="proj-title" className="mb-1.5 block text-sm font-medium text-slate-800">
                  Tên dự án <span className="text-red-500">*</span>
                </label>
                <input
                  id="proj-title"
                  type="text"
                  autoComplete="off"
                  placeholder="Ví dụ: Xây MVP landing page cho startup edtech"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label htmlFor="proj-desc" className="mb-1.5 block text-sm font-medium text-slate-800">
                  Mô tả ngắn
                </label>
                <textarea
                  id="proj-desc"
                  rows={4}
                  placeholder="Bối cảnh, hạn chế thời gian, công nghệ bạn đang dùng (nếu có)…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label htmlFor="proj-goals" className="mb-1.5 block text-sm font-medium text-slate-800">
                  Mục tiêu cụ thể
                </label>
                <textarea
                  id="proj-goals"
                  rows={3}
                  placeholder="Ví dụ: Hoàn thành báo cáo chương 3, chuẩn bị slide bảo vệ…"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <span className="mb-2 block text-sm font-medium text-slate-800">Thời gian dự kiến</span>
                <div className="flex flex-wrap gap-2">
                  {durationOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDuration(opt.value)}
                      className={cn(
                        'rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
                        duration === opt.value
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Ước tính:{' '}
                  <span className="font-medium text-slate-700">
                    {durationOptions.find((d) => d.value === duration)?.label ?? '—'}
                  </span>
                </p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard>
            <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Lightbulb className="size-5" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">Lĩnh vực & kỹ năng</h2>
                <p className="mt-0.5 text-sm text-slate-600">
                  Chọn các mục liên quan — dùng để xếp hạng mentor gợi ý bên phải.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {topicTags.map((tag) => {
                const on = selectedTags.has(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition',
                      on
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm'
                        : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-white',
                    )}
                  >
                    {on ? <Check className="size-3.5 shrink-0" strokeWidth={2.5} /> : null}
                    {tag}
                  </button>
                );
              })}
            </div>
          </DashboardCard>

          {submitError ? (
            <p className="text-sm font-medium text-red-600" role="alert">
              {submitError}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/dashboard/projects"
              className="order-2 text-center text-sm font-medium text-slate-600 hover:text-slate-900 sm:order-1 sm:mr-auto"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="order-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-60 sm:order-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" strokeWidth={2.5} />
                  Đang lưu…
                </>
              ) : (
                <>
                  <Send className="size-4" strokeWidth={2} />
                  Tạo dự án
                </>
              )}
            </button>
          </div>
        </form>

        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <DashboardCard className="border-indigo-100/80 bg-linear-to-b from-white to-slate-50/90">
            <div className="flex items-center gap-2 text-indigo-900">
              <Sparkles className="size-5 shrink-0 text-indigo-600" strokeWidth={2} />
              <h2 className="text-base font-semibold tracking-tight">Mentor gợi ý</h2>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Sắp xếp theo độ phù hợp với tag và nội dung bạn nhập. Chọn mentor để xem hồ sơ hoặc nhắn tin sau
              khi tạo dự án.
            </p>

            {mentorsError ? (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                {mentorsError}
              </p>
            ) : null}

            <div className="mt-5 space-y-3">
              {mentorsLoading ? (
                <ul className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <li
                      key={i}
                      className="flex gap-3 rounded-xl border border-slate-100 bg-white/80 p-3 animate-pulse"
                    >
                      <div className="size-12 shrink-0 rounded-xl bg-slate-200" />
                      <div className="flex-1 space-y-2 pt-0.5">
                        <div className="h-4 w-3/4 rounded bg-slate-200" />
                        <div className="h-3 w-1/2 rounded bg-slate-200" />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : topSuggestions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-8 text-center text-sm text-slate-600">
                  <p>Chưa có mentor để gợi ý.</p>
                  <Link href="/mentors" className="mt-2 inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline">
                    Tìm mentor
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {topSuggestions.map(({ mentor, matchPct }) => {
                    const info = mentor.mentorInfo!;
                    const overlap = (info.expertise ?? []).filter((e) => selectedTags.has(e));
                    return (
                      <li key={mentor.id}>
                        <div className="group rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
                          <div className="flex gap-3">
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/80">
                              <Image
                                src={mentor.avatar || 'https://i.pravatar.cc/128?u=fallback'}
                                alt=""
                                width={48}
                                height={48}
                                className="size-full object-cover"
                                unoptimized={
                                  Boolean(mentor.avatar?.includes('pravatar') || mentor.avatar?.includes('picsum'))
                                }
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="truncate font-semibold text-slate-900">{mentor.name}</p>
                                <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-800">
                                  {matchPct != null ? `~${matchPct}% khớp` : 'Gợi ý'}
                                </span>
                              </div>
                              <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{info.headline}</p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {(overlap.length ? overlap : info.expertise.slice(0, 3)).map((t) => (
                                  <span
                                    key={t}
                                    className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-700"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                              <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                                <div className="flex items-center gap-3 text-xs text-slate-600">
                                  <span className="inline-flex items-center gap-0.5 font-medium text-amber-700">
                                    <Star className="size-3.5 fill-amber-400 text-amber-500" />
                                    {(info.rating ?? mentor.rating ?? 0).toFixed(1)}
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="size-3.5 text-slate-400" />
                                    {info.sessionsCompleted ?? 0} buổi
                                  </span>
                                </div>
                                <Link
                                  href={`/profile/${mentor.id}`}
                                  className="text-xs font-semibold text-indigo-600 hover:underline"
                                >
                                  Hồ sơ
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="mt-5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Mẹo:</span> chọn đủ lĩnh vực và mô tả từ khóa trong
              tiêu đề để gợi ý chính xác hơn.
            </div>
          </DashboardCard>
        </aside>
      </div>
    </div>
  );
}
