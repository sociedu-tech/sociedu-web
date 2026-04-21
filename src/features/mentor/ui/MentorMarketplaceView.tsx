'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  User as UserIcon,
  X,
  SlidersHorizontal,
  BadgeCheck,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { MarketingHeroSection } from '@/components/marketing';
import { Container } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { MentorMarketplaceViewModel } from '@/features/mentor/marketplace/mentorMarketplace.types';
import { SORT_OPTIONS, formatMentorPrice, type SortKey } from '@/features/mentor/marketplace/mentorMarketplace.constants';

const SUGGESTED_SEARCHES = ['Đồ án web', 'NCKH', 'BTL', 'Phỏng vấn thực tập', 'Machine learning'];

function MentorCardSkeleton() {
  return (
    <div className="rounded-2xl border border-marketing-card-border bg-page p-5 ring-0 transition">
      <div className="flex gap-4">
        <div className="h-[72px] w-[72px] shrink-0 animate-pulse rounded-2xl bg-marketing-canvas" />
        <div className="flex-1 space-y-2 pt-0.5">
          <div className="h-4 w-2/3 animate-pulse rounded-md bg-marketing-canvas" />
          <div className="h-3 w-1/2 animate-pulse rounded-md bg-marketing-canvas" />
          <div className="h-3 w-1/3 animate-pulse rounded-md bg-marketing-canvas" />
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-7 w-18 animate-pulse rounded-full bg-marketing-canvas" />
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-marketing-border pt-4">
        <div className="h-8 w-24 animate-pulse rounded-md bg-marketing-canvas" />
        <div className="h-10 w-32 animate-pulse rounded-lg bg-marketing-canvas" />
      </div>
    </div>
  );
}

const RATING_CHIPS: { value: number; label: string }[] = [
  { value: 0, label: 'Bất kỳ' },
  { value: 4, label: 'Từ 4.0★' },
  { value: 4.5, label: 'Từ 4.5★' },
];

const MIN_SESSIONS_CHIPS: { value: number; label: string }[] = [
  { value: 0, label: 'Bất kỳ' },
  { value: 5, label: '≥ 5 buổi' },
  { value: 10, label: '≥ 10 buổi' },
  { value: 20, label: '≥ 20 buổi' },
  { value: 40, label: '≥ 40 buổi' },
];

function MarketplaceFilters({
  variant = 'desktop',
  vm,
}: {
  variant?: 'desktop' | 'mobile';
  vm: MentorMarketplaceViewModel;
}) {
  const {
    verifiedOnly,
    setVerifiedOnly,
    selectedCategories,
    selectedSkills,
    selectedUniversities,
    selectedMajors,
    selectedYears,
    allCategories,
    allSkills,
    allUniversities,
    allMajors,
    allYears,
    toggleCategory,
    toggleSkill,
    toggleUniversity,
    toggleMajor,
    toggleYear,
    minRating,
    setMinRating,
    minSessions,
    setMinSessions,
    maxPrice,
    setMaxPrice,
    priceBounds,
    clearFilters,
    activeFilterCount,
    setShowMobileFilters,
  } = vm;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-sm font-bold uppercase tracking-wider text-marketing-fg-strong">Bộ lọc</h2>
        </div>
        {activeFilterCount > 0 && (
          <button type="button" onClick={clearFilters} className="text-xs font-semibold text-primary hover:underline">
            Xóa ({activeFilterCount})
          </button>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-marketing-fg-muted">Đã xác thực</h3>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-marketing-border bg-page px-3 py-2.5 transition hover:border-marketing-border-dashed">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="h-4 w-4 rounded border-marketing-border text-primary focus:ring-primary/40"
          />
          <span className="flex items-center gap-1.5 text-sm text-marketing-fg-strong">
            <BadgeCheck className="h-4 w-4 text-primary" aria-hidden />
            Chỉ mentor đã xác thực
          </span>
        </label>
      </div>

      {allUniversities.length > 0 && (
        <div>
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-marketing-fg-muted">Trường</h3>
          <div className="flex flex-wrap gap-2">
            {allUniversities.map((uni) => {
              const active = selectedUniversities.includes(uni);
              return (
                <button
                  key={uni}
                  type="button"
                  onClick={() => toggleUniversity(uni)}
                  aria-pressed={active}
                  title={uni}
                  className={cn(
                    'max-w-full truncate rounded-full border px-3 py-1.5 text-left text-xs font-semibold transition',
                    active
                      ? 'border-primary bg-primary text-white'
                      : 'border-marketing-border bg-page text-marketing-body hover:border-marketing-border-dashed hover:text-marketing-fg-strong',
                  )}
                >
                  {uni}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {allMajors.length > 0 && (
        <div>
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-marketing-fg-muted">Ngành học</h3>
          <div className="flex flex-wrap gap-2">
            {allMajors.map((maj) => {
              const active = selectedMajors.includes(maj);
              return (
                <button
                  key={maj}
                  type="button"
                  onClick={() => toggleMajor(maj)}
                  aria-pressed={active}
                  title={maj}
                  className={cn(
                    'max-w-full truncate rounded-full border px-3 py-1.5 text-left text-xs font-semibold transition',
                    active
                      ? 'border-primary bg-primary text-white'
                      : 'border-marketing-border bg-page text-marketing-body hover:border-marketing-border-dashed hover:text-marketing-fg-strong',
                  )}
                >
                  {maj}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {allYears.length > 0 && (
        <div>
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-marketing-fg-muted">Khóa / năm</h3>
          <div className="flex flex-wrap gap-2">
            {allYears.map((y) => {
              const active = selectedYears.includes(y);
              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => toggleYear(y)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-semibold tabular-nums transition',
                    active
                      ? 'border-primary bg-primary text-white'
                      : 'border-marketing-border bg-page text-marketing-body hover:border-marketing-border-dashed hover:text-marketing-fg-strong',
                  )}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {allCategories.length > 0 && (
        <div>
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-marketing-fg-muted">
            Chuyên môn & đề tài
          </h3>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => {
              const active = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                    active
                      ? 'border-primary bg-primary text-white'
                      : 'border-marketing-border bg-page text-marketing-body hover:border-marketing-border-dashed hover:text-marketing-fg-strong',
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {allSkills.length > 0 && (
        <div>
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-marketing-fg-muted">Kỹ năng (CV)</h3>
          <p className="mb-2 text-[11px] leading-snug text-marketing-fg-subtle">
            Mentor có ít nhất một kỹ năng trong các lựa chọn bạn chọn.
          </p>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((sk) => {
              const active = selectedSkills.includes(sk);
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => toggleSkill(sk)}
                  aria-pressed={active}
                  title={sk}
                  className={cn(
                    'max-w-full truncate rounded-full border px-3 py-1.5 text-left text-xs font-semibold transition',
                    active
                      ? 'border-primary bg-primary text-white'
                      : 'border-marketing-border bg-page text-marketing-body hover:border-marketing-border-dashed hover:text-marketing-fg-strong',
                  )}
                >
                  {sk}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-marketing-fg-muted">Đánh giá tối thiểu</h3>
        <div className="flex flex-wrap gap-2">
          {RATING_CHIPS.map(({ value, label }) => {
            const active = minRating === value;
            return (
              <button
                key={String(value)}
                type="button"
                onClick={() => setMinRating(value)}
                aria-pressed={active}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                  active
                    ? 'border-primary bg-primary text-white'
                    : 'border-marketing-border bg-page text-marketing-body hover:border-marketing-border-dashed hover:text-marketing-fg-strong',
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-marketing-fg-muted">Buổi đã hoàn thành</h3>
        <p className="mb-2 text-[11px] leading-snug text-marketing-fg-subtle">Tối thiểu số buổi mentor đã kèm trên nền tảng.</p>
        <div className="flex flex-wrap gap-2">
          {MIN_SESSIONS_CHIPS.map(({ value, label }) => {
            const active = minSessions === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setMinSessions(value)}
                aria-pressed={active}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                  active
                    ? 'border-primary bg-primary text-white'
                    : 'border-marketing-border bg-page text-marketing-body hover:border-marketing-border-dashed hover:text-marketing-fg-strong',
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-marketing-fg-muted">Giá tối đa</h3>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max || 1000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Giá tối đa"
          className="w-full accent-primary"
        />
        <div className="mt-1 flex justify-between text-xs font-semibold text-marketing-fg-muted">
          <span>${priceBounds.min}</span>
          <span className="text-marketing-fg-strong">≤ ${maxPrice}/giờ</span>
        </div>
      </div>

      {variant === 'mobile' && (
        <button
          type="button"
          onClick={() => setShowMobileFilters(false)}
          className="btn-primary w-full justify-center rounded-xl py-3 text-sm font-semibold"
        >
          Áp dụng bộ lọc
        </button>
      )}
    </div>
  );
}

export function MentorMarketplaceView(vm: MentorMarketplaceViewModel) {
  const {
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    showMobileFilters,
    setShowMobileFilters,
    filtered,
    activeFilterCount,
    clearFilters,
    retry,
  } = vm;

  return (
    <div className="min-h-screen bg-page pb-24 text-dark">
      <MarketingHeroSection variant="mentor">
        <Container className="max-w-3xl py-12 md:py-16">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-marketing-border/90 bg-white/90 px-3.5 py-1.5 text-xs font-medium text-marketing-body shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20" />
              Danh bạ mentor sinh viên · Mentoree
            </div>

            <h1 className="mt-6 text-balance font-black tracking-tight text-marketing-fg md:mt-7">
              <span className="block text-2xl leading-tight sm:text-3xl md:text-[2.15rem] md:leading-[1.15]">
                Mentor kèm{' '}
                <span className="bg-linear-to-br from-primary via-primary to-secondary-purple bg-clip-text text-transparent">
                  đồ án, BTL, NCKH
                </span>
              </span>
              <span className="mt-2 block text-lg font-extrabold text-marketing-fg-muted sm:text-xl md:text-2xl">
                cho sinh viên — tìm đúng người, đúng việc
              </span>
            </h1>

            <p className="mt-5 text-pretty text-sm leading-relaxed text-marketing-body md:text-base">
              Anh chị đi trước và chuyên gia trong ngành đồng hành 1-1: đồ án môn học, bài tập lớn, đồ án tốt nghiệp,
              nghiên cứu khoa học, khóa luận và luyện phỏng vấn thực tập.
            </p>

            <form
              className="mt-8 flex w-full flex-col gap-2 rounded-2xl border border-marketing-border bg-white/95 p-2 shadow-sm backdrop-blur-sm sm:flex-row sm:items-stretch"
              onSubmit={(e) => e.preventDefault()}
              role="search"
            >
              <div className="flex min-h-[48px] flex-1 items-center gap-2.5 px-3 sm:px-4">
                <Search className="h-4 w-4 shrink-0 text-marketing-fg-subtle" aria-hidden />
                <input
                  type="search"
                  placeholder="Tên mentor, môn, đề tài (VD: đồ án web, NCKH Kinh tế…)"
                  className="w-full bg-transparent py-2 text-sm font-medium text-marketing-fg-strong outline-hidden placeholder:text-marketing-fg-subtle"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Tìm mentor"
                />
                {searchTerm ? (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="rounded-full p-1.5 text-marketing-fg-muted hover:bg-marketing-canvas"
                    aria-label="Xoá từ khoá"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
              <button
                type="submit"
                className="btn-primary inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold sm:rounded-xl sm:py-0"
              >
                Tìm
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-marketing-fg-subtle">Gợi ý:</span>
              {SUGGESTED_SEARCHES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setSearchTerm(q)}
                  className="rounded-full border border-marketing-border bg-white/80 px-3 py-1 text-xs font-semibold text-marketing-body transition hover:border-primary/40 hover:text-primary"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </MarketingHeroSection>

      <Container>
        <div
          className={cn(
            'sticky z-40 -mx-4 mt-8 flex flex-col gap-3 border border-marketing-border bg-page/90 px-4 py-3 backdrop-blur-md sm:mx-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:rounded-2xl sm:px-5',
            'top-24',
          )}
        >
          <p className="text-sm text-marketing-body" aria-live="polite">
            {loading ? (
              'Đang tải mentor…'
            ) : (
              <>
                <span className="font-bold tabular-nums text-marketing-fg-strong">{filtered.length}</span>
                <span className="font-medium"> mentor phù hợp</span>
                {activeFilterCount > 0 ? (
                  <span className="text-marketing-fg-muted"> · {activeFilterCount} bộ lọc đang bật</span>
                ) : null}
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-marketing-border bg-page px-3.5 py-2 text-sm font-semibold text-marketing-fg-strong transition hover:border-marketing-border-dashed lg:hidden"
              aria-label="Mở bộ lọc"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Lọc
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-marketing-border bg-page px-3.5 py-2 text-sm sm:min-w-[220px] sm:flex-initial">
              <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-marketing-fg-muted">Sắp xếp</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-marketing-fg-strong outline-hidden sm:flex-initial"
                aria-label="Sắp xếp danh sách mentor"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {showMobileFilters && (
          <>
            <button
              type="button"
              aria-label="Đóng bộ lọc"
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-150 bg-black/45 backdrop-blur-[2px] lg:hidden"
            />
            <aside
              className="fixed top-0 right-0 bottom-0 z-160 flex w-[min(100%,22rem)] flex-col overflow-hidden rounded-l-3xl border-l border-marketing-border bg-page lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Bộ lọc mentor"
            >
              <div className="flex items-center justify-between border-b border-marketing-border px-5 py-4">
                <h2 className="text-base font-bold text-marketing-fg-strong">Bộ lọc</h2>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-full p-2 text-marketing-fg-muted hover:bg-marketing-canvas"
                  aria-label="Đóng"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-6">
                <MarketplaceFilters variant="mobile" vm={vm} />
              </div>
            </aside>
          </>
        )}

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-4 lg:items-start lg:gap-10">
          <aside className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-28 rounded-2xl border border-marketing-border bg-page p-5">
              <MarketplaceFilters vm={vm} />
            </div>
          </aside>

          <section className="min-w-0 lg:col-span-3" aria-label="Danh sách mentor">
            {error ? (
              <ErrorMessage message={error} onRetry={retry} />
            ) : loading ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <MentorCardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-marketing-border-dashed bg-marketing-canvas/50 py-16 text-center md:py-20">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-page ring-1 ring-marketing-border">
                  <UserIcon className="h-7 w-7 text-marketing-fg-subtle" aria-hidden />
                </div>
                <h2 className="text-lg font-bold text-marketing-fg-strong">Không tìm thấy mentor phù hợp</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-marketing-body">
                  Thử gợi ý tìm kiếm phía trên, bỏ bớt trường / ngành / kỹ năng / mức giá hoặc nới điều kiện đánh giá · buổi đã hoàn thành.
                </p>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center gap-1.5 rounded-xl border border-marketing-border bg-page px-4 py-2.5 text-sm font-semibold text-primary transition hover:border-primary"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {filtered.map((mentor) => {
                  const info = mentor.mentorInfo!;
                  const verified = info.verificationStatus === 'verified';
                  return (
                    <li key={mentor.id}>
                      <article
                        className={cn(
                          'group flex h-full flex-col rounded-2xl border border-marketing-card-border bg-page p-5 transition',
                          'hover:border-primary/35 hover:ring-1 hover:ring-primary/15',
                        )}
                      >
                        <div className="flex gap-4">
                          <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-marketing-canvas ring-1 ring-marketing-border/80">
                            {mentor.avatar ? (
                              <Image
                                src={mentor.avatar}
                                alt={`Ảnh đại diện của ${mentor.name}`}
                                className="object-cover"
                                fill
                                sizes="72px"
                                unoptimized
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-marketing-fg-subtle">
                                <UserIcon className="h-7 w-7" aria-hidden />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h3 className="truncate text-base font-bold text-marketing-fg-strong transition-colors group-hover:text-primary">
                                {mentor.name}
                              </h3>
                              {verified && (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-label="Đã xác thực" />
                              )}
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-snug text-marketing-body">
                              {info.headline || 'Mentor Mentoree'}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                              <span className="inline-flex items-center gap-1 font-bold text-marketing-fg-strong">
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" aria-hidden />
                                {info.rating?.toFixed(1) ?? '—'}
                              </span>
                              <span className="hidden h-1 w-1 rounded-full bg-marketing-border sm:inline" aria-hidden />
                              <span className="font-semibold text-marketing-fg-muted">{info.sessionsCompleted ?? 0} buổi</span>
                            </div>
                          </div>
                        </div>

                        {info.expertise && info.expertise.length > 0 && (
                          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Chuyên môn">
                            {info.expertise.slice(0, 4).map((exp) => (
                              <li
                                key={exp}
                                className="rounded-full border border-marketing-border bg-marketing-canvas/80 px-2.5 py-1 text-[11px] font-semibold text-marketing-list"
                              >
                                {exp}
                              </li>
                            ))}
                            {info.expertise.length > 4 && (
                              <li className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-marketing-fg-muted">
                                +{info.expertise.length - 4}
                              </li>
                            )}
                          </ul>
                        )}

                        <div className="mt-auto flex items-end justify-between gap-3 border-t border-marketing-border pt-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-marketing-fg-muted">Từ</p>
                            <p className="text-lg font-black tracking-tight text-marketing-fg-strong">
                              {formatMentorPrice(info.price)}
                              <span className="ml-0.5 text-xs font-medium text-marketing-body">/giờ</span>
                            </p>
                          </div>
                          <Link
                            href={`/profile/${mentor.id}`}
                            className="btn-primary inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold"
                            aria-label={`Xem hồ sơ mentor ${mentor.name}`}
                          >
                            Xem hồ sơ
                            <ArrowRight className="h-4 w-4" aria-hidden />
                          </Link>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <section className="mt-16 overflow-hidden rounded-2xl border border-marketing-panel-border bg-marketing-panel px-6 py-10 text-white md:mt-20 md:px-10 md:py-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight md:text-3xl">Mentor Mentoree hỗ trợ sinh viên việc gì?</h2>
              <p className="mt-4 text-sm leading-relaxed text-marketing-on-panel-soft md:text-base">
                Đồng hành bài tập lớn, đồ án môn học, đồ án tốt nghiệp (ĐATN), nghiên cứu khoa học (NCKH), khóa luận,
                tiểu luận và luyện phỏng vấn thực tập/fresher ở nhiều ngành: CNTT, Kinh tế, Điện - Điện tử, Cơ khí, Xây dựng,
                Ngoại ngữ, Thiết kế, Dữ liệu. Bạn xem chuyên môn, đánh giá và giá trước khi đặt buổi.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-marketing-on-panel-soft">
              {[
                'Mentor là anh chị đi trước, hồ sơ đã xác thực',
                'Gói lẻ gỡ khó hoặc gói đi cùng đến khi bảo vệ',
                'Giá sinh viên · thanh toán an toàn · hoàn tiền minh bạch',
                'Chỉ hướng dẫn & review — không làm hộ, tránh vi phạm học thuật',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Container>

      {loading && (
        <span className="sr-only" role="status">
          <LoadingSpinner size={16} label="Đang tải mentor" />
        </span>
      )}
    </div>
  );
}
