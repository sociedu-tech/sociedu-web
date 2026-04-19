'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import type { User } from '@/types';
import { mentorService } from '@/services/mentorService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { cn } from '@/lib/utils';

type SortKey = 'popular' | 'price-asc' | 'price-desc' | 'rating';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'Phổ biến' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
  { value: 'price-asc', label: 'Giá: thấp → cao' },
  { value: 'price-desc', label: 'Giá: cao → thấp' },
];

function formatPrice(value?: number) {
  if (value === undefined || value === null) return 'Liên hệ';
  return `$${value}`;
}

function MentorCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex gap-4">
        <div className="h-16 w-16 shrink-0 animate-pulse rounded-xl bg-surface-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded bg-surface-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-surface-muted" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-surface-muted" />
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-6 w-16 animate-pulse rounded-full bg-surface-muted" />
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div className="h-5 w-20 animate-pulse rounded bg-surface-muted" />
        <div className="h-9 w-28 animate-pulse rounded-lg bg-surface-muted" />
      </div>
    </div>
  );
}

export const MentorMarketplace = () => {
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<SortKey>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const ms = searchTerm.trim() ? 400 : 0;
    const id = window.setTimeout(() => setDebouncedQuery(searchTerm.trim()), ms);
    return () => window.clearTimeout(id);
  }, [searchTerm]);

  const fetchMentors = async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mentorService.getMentors(q ? { q } : undefined);
      setMentors(data);
    } catch {
      setError('Không thể tải danh sách mentor. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors(debouncedQuery);
  }, [debouncedQuery]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    mentors.forEach((m) => m.mentorInfo?.expertise?.forEach((e) => set.add(e)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [mentors]);

  const priceBounds = useMemo(() => {
    const prices = mentors.map((m) => m.mentorInfo?.price ?? 0).filter((p) => p > 0);
    if (prices.length === 0) return { min: 0, max: 1000 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [mentors]);

  useEffect(() => {
    // Reset maxPrice sau khi dữ liệu mentor được tải
    setMaxPrice(priceBounds.max || 1000);
  }, [priceBounds.max]);

  const filtered = useMemo(() => {
    const list = mentors.filter((m) => {
      const info = m.mentorInfo;
      if (!info) return false;
      if (verifiedOnly && info.verificationStatus !== 'verified') return false;
      if (selectedCategories.length > 0) {
        const hit = info.expertise?.some((e) => selectedCategories.includes(e));
        if (!hit) return false;
      }
      if (typeof info.price === 'number' && info.price > maxPrice) return false;
      return true;
    });

    list.sort((a, b) => {
      const ai = a.mentorInfo!;
      const bi = b.mentorInfo!;
      switch (sortBy) {
        case 'price-asc':
          return (ai.price ?? 0) - (bi.price ?? 0);
        case 'price-desc':
          return (bi.price ?? 0) - (ai.price ?? 0);
        case 'rating':
          return (bi.rating ?? 0) - (ai.rating ?? 0);
        case 'popular':
        default:
          return (bi.sessionsCompleted ?? 0) - (ai.sessionsCompleted ?? 0);
      }
    });
    return list;
  }, [mentors, selectedCategories, verifiedOnly, maxPrice, sortBy]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setVerifiedOnly(false);
    setMaxPrice(priceBounds.max || 1000);
    setSearchTerm('');
  };

  const activeFilterCount =
    selectedCategories.length + (verifiedOnly ? 1 : 0) + (maxPrice < (priceBounds.max || 1000) ? 1 : 0);

  const Filters = ({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-sm font-bold uppercase tracking-wider text-dark">Bộ lọc</h2>
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Xóa ({activeFilterCount})
          </button>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray">
          Đã xác thực
        </h3>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-3 py-2.5 transition hover:border-border-hover">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/40"
          />
          <span className="flex items-center gap-1.5 text-sm text-dark">
            <BadgeCheck className="h-4 w-4 text-primary" aria-hidden />
            Chỉ mentor đã xác thực
          </span>
        </label>
      </div>

      {allCategories.length > 0 && (
        <div>
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray">
            Lĩnh vực
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
                      : 'border-border bg-white text-gray hover:border-border-hover hover:text-dark'
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray">
          Giá tối đa
        </h3>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max || 1000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Giá tối đa"
          className="w-full accent-primary"
        />
        <div className="mt-1 flex justify-between text-xs font-semibold text-gray">
          <span>${priceBounds.min}</span>
          <span className="text-dark">≤ ${maxPrice}/giờ</span>
        </div>
      </div>

      {variant === 'mobile' && (
        <button
          type="button"
          onClick={() => setShowMobileFilters(false)}
          className="btn-primary w-full justify-center rounded-lg py-2.5 text-sm"
        >
          Áp dụng bộ lọc
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero — tông sáng, đơn giản, đồng bộ landing */}
      <section className="relative overflow-hidden border-b border-border bg-surface-muted">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-24 left-1/2 h-[280px] w-[720px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <p className="text-[11px] font-bold  text-primary">
            Danh bạ mentor sinh viên · Mentoree
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-tight text-dark md:text-5xl">
            Mentor kèm <span className="text-primary">đồ án, BTL, NCKH</span> cho sinh viên
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray md:text-base">
            Tìm anh chị đi trước và chuyên gia đang làm việc trong ngành để được kèm 1-1: đồ án môn học,
            bài tập lớn, đồ án tốt nghiệp, nghiên cứu khoa học, khóa luận và luyện phỏng vấn thực tập.
          </p>

          <form
            className="mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border border-border bg-white p-2"
            onSubmit={(e) => e.preventDefault()}
            role="search"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-4 w-4 text-gray" aria-hidden />
              <input
                type="search"
                placeholder="Tên mentor, môn học, đề tài (VD: đồ án web, NCKH Kinh tế…)"
                className="w-full bg-transparent py-2.5 text-sm font-medium outline-hidden placeholder:text-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Tìm mentor"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="rounded-full p-1 text-gray hover:bg-surface-muted"
                  aria-label="Xoá từ khoá"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary inline-flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm"
            >
              Tìm <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Thanh công cụ: số kết quả + sắp xếp + mở filter mobile */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray" aria-live="polite">
            {loading ? (
              'Đang tải mentor…'
            ) : (
              <>
                <span className="font-semibold text-dark">{filtered.length}</span> mentor phù hợp
                {activeFilterCount > 0 ? ` · ${activeFilterCount} bộ lọc` : ''}
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-dark hover:border-border-hover lg:hidden"
              aria-label="Mở bộ lọc"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Lọc
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <label className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm">
              <span className="hidden text-xs font-semibold uppercase tracking-wide text-gray sm:inline">
                Sắp xếp
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="bg-transparent text-sm font-semibold text-dark outline-hidden"
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

        {/* Bộ lọc di động */}
        {showMobileFilters && (
          <>
            <button
              type="button"
              aria-label="Đóng bộ lọc"
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-150 bg-black/40 lg:hidden"
            />
            <aside
              className="fixed right-0 top-0 bottom-0 z-160 w-[88%] max-w-sm overflow-y-auto bg-white p-6 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Bộ lọc mentor"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-base font-bold text-dark">Bộ lọc</h2>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-full p-1.5 text-gray hover:bg-surface-muted"
                  aria-label="Đóng"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Filters variant="mobile" />
            </aside>
          </>
        )}

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-5">
              <Filters />
            </div>
          </aside>

          <section className="lg:col-span-3" aria-label="Danh sách mentor">
            {error ? (
              <ErrorMessage message={error} onRetry={() => fetchMentors(debouncedQuery)} />
            ) : loading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <MentorCardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-white py-20 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
                  <UserIcon className="h-7 w-7 text-gray-300" aria-hidden />
                </div>
                <h2 className="text-lg font-bold text-dark">Không tìm thấy mentor phù hợp</h2>
                <p className="mt-1 text-sm text-gray">
                  Thử xóa bớt bộ lọc hoặc tìm theo từ khoá khác.
                </p>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-primary"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filtered.map((mentor) => {
                  const info = mentor.mentorInfo!;
                  const verified = info.verificationStatus === 'verified';
                  return (
                    <li key={mentor.id}>
                      <article className="group h-full rounded-2xl border border-border bg-white p-5 transition hover:border-primary/40">
                        <div className="flex gap-4">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                            {mentor.avatar ? (
                              <Image
                                src={mentor.avatar}
                                alt={`Ảnh đại diện của ${mentor.name}`}
                                className="object-cover"
                                fill
                                sizes="64px"
                                unoptimized
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-300">
                                <UserIcon className="h-6 w-6" aria-hidden />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h3 className="truncate text-base font-bold text-dark transition-colors group-hover:text-primary">
                                {mentor.name}
                              </h3>
                              {verified && (
                                <CheckCircle2
                                  className="h-4 w-4 shrink-0 text-primary"
                                  aria-label="Đã xác thực"
                                />
                              )}
                            </div>
                            <p className="mt-0.5 line-clamp-1 text-xs font-medium text-gray">
                              {info.headline || 'Mentor Mentoree'}
                            </p>
                            <div className="mt-2 flex items-center gap-3 text-xs">
                              <span className="inline-flex items-center gap-1 font-bold text-dark">
                                <Star
                                  className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                                  aria-hidden
                                />
                                {info.rating?.toFixed(1) ?? '—'}
                              </span>
                              <span className="h-1 w-1 rounded-full bg-gray-300" aria-hidden />
                              <span className="font-semibold text-gray">
                                {info.sessionsCompleted ?? 0} buổi
                              </span>
                            </div>
                          </div>
                        </div>

                        {info.expertise && info.expertise.length > 0 && (
                          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Chuyên môn">
                            {info.expertise.slice(0, 4).map((exp) => (
                              <li
                                key={exp}
                                className="rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-gray-700"
                              >
                                {exp}
                              </li>
                            ))}
                            {info.expertise.length > 4 && (
                              <li className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-gray">
                                +{info.expertise.length - 4}
                              </li>
                            )}
                          </ul>
                        )}

                        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray">
                              Từ
                            </p>
                            <p className="text-lg font-black tracking-tight text-dark">
                              {formatPrice(info.price)}
                              <span className="ml-0.5 text-xs font-medium text-gray">/giờ</span>
                            </p>
                          </div>
                          <Link
                            href={`/profile/${mentor.id}`}
                            className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm"
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

        {/* Nội dung SEO phụ — đoạn mô tả cho bot & người đọc */}
        <section className="mt-16 grid gap-6 rounded-2xl border border-border bg-surface-muted p-6 md:grid-cols-3 md:p-10">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-black tracking-tight text-dark md:text-3xl">
              Mentor Mentoree hỗ trợ sinh viên việc gì?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray md:text-base">
              Mentor đồng hành với bài tập lớn, đồ án môn học, đồ án tốt nghiệp (ĐATN), nghiên cứu khoa học
              (NCKH), khóa luận, tiểu luận và luyện phỏng vấn thực tập/fresher ở nhiều ngành: CNTT, Kinh tế,
              Điện - Điện tử, Cơ khí, Xây dựng, Ngoại ngữ, Thiết kế, Dữ liệu. Bạn xem được chuyên môn, đánh
              giá và mức giá trước khi đặt buổi.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-gray">
            {[
              'Mentor là anh chị đi trước, hồ sơ đã xác thực',
              'Gói lẻ gỡ khó hoặc gói đi cùng đến khi bảo vệ',
              'Giá sinh viên · thanh toán an toàn · hoàn tiền minh bạch',
              'Chỉ hướng dẫn & review — không làm hộ, tránh vi phạm học thuật',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {loading && (
        <span className="sr-only" role="status">
          <LoadingSpinner size={16} label="Đang tải mentor" />
        </span>
      )}
    </div>
  );
};
