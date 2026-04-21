'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Plus, Minus, Sparkles, Video } from 'lucide-react';
import { Button, Container } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  landingHero,
  landingStats,
  landingAboutSection,
  landingAboutBlocks,
  landingWhyIntro,
  landingWhyChoose,
  landingFeaturesIntro,
  landingFeatures,
  landingFaqSection,
  faqs,
  landingCta,
} from '@/data/landingContent';
import { useLandingPage } from '@/features/landing/hooks';

const SECTION_SCROLL_MARGIN = 'scroll-mt-24 md:scroll-mt-28';

export const LandingPage = () => {
  const { openFaq, setOpenFaq } = useLandingPage();

  return (
    <div className="min-h-screen bg-white text-dark">
      {/* Hero — bento + ambient; tách nhịp so với phần còn lại của landing */}
      <section
        id="hero"
        className="relative overflow-hidden border-b border-border bg-zinc-50 pt-10 pb-16 md:pt-14 md:pb-20"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-[18%] -top-[20%] h-[min(560px,90vh)] w-[min(72vw,640px)] rounded-full bg-primary/[0.14] blur-[120px]" />
          <div className="absolute -right-[12%] top-[30%] h-[380px] w-[min(56vw,520px)] rounded-full bg-secondary-purple/11 blur-[100px]" />
          <div className="absolute inset-0 bg-linear-to-b from-white via-transparent to-zinc-50/90" />
        </div>

        <Container className="relative z-10">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:items-center lg:gap-14 xl:gap-16">
            <div className="min-w-0 lg:max-w-xl xl:max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white/90 px-3.5 py-1.5 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20" />
                {landingHero.eyebrow}
              </div>

              <h1 className="mt-7 text-balance font-black uppercase tracking-tight text-zinc-900">
                <span className="block text-[1.35rem] leading-snug text-zinc-500 sm:text-2xl md:text-[1.75rem]">
                  {landingHero.titleLine1}
                </span>
                <span className="mt-3 block text-[2rem] leading-[1.12] sm:text-[2.35rem] sm:leading-[1.1] md:text-[2.65rem] lg:text-[2.85rem]">
                  <span
                    className="bg-linear-to-br from-primary via-primary to-secondary-purple bg-clip-text text-transparent"
                    style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    {landingHero.titleHighlight}
                  </span>{' '}
                  <span className="text-zinc-800">{landingHero.titleLine2}</span>
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-zinc-600 md:text-lg">
                {landingHero.subtitle}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button href={landingHero.primaryCta.href} variant="primary" size="pill" className="w-full sm:w-auto">
                  {landingHero.primaryCta.label}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </Button>
                <Button
                  href={landingHero.secondaryCta.href}
                  variant="secondary"
                  size="pill"
                  className="w-full border-zinc-200 bg-white/90 sm:w-auto"
                >
                  {landingHero.secondaryCta.label}
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-zinc-200/80 pt-8">
                {landingStats.map((s) => (
                  <div key={s.label} className="min-w-[calc(50%-0.75rem)] sm:min-w-0">
                    <p className="text-lg font-semibold tabular-nums tracking-tight text-zinc-900 md:text-xl">
                      {s.value}
                    </p>
                    <p className="mt-0.5 text-sm leading-snug text-zinc-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none" aria-hidden>
              <div className="grid grid-cols-12 gap-3 sm:grid-rows-2 sm:gap-4">
                <div className="relative z-10 col-span-12 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.45)] sm:col-span-7 sm:row-span-2 sm:min-h-[320px]">
                  <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5 sm:px-4">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
                      <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
                      <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
                    </div>
                    <div className="ml-2 flex min-w-0 flex-1 items-center rounded-md bg-zinc-900/80 px-2.5 py-1 text-[11px] text-zinc-400">
                      <span className="wrap-break-word">mentoree.app / lịch học</span>
                    </div>
                  </div>
                  <div className="space-y-3 p-3 sm:p-4">
                    <div className="rounded-xl bg-zinc-900/50 p-3 ring-1 ring-white/10">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-zinc-400">Buổi sắp tới</p>
                        <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">
                          Đã xác nhận
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-white">Kèm outline đồ án mạng máy tính</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                        <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-zinc-300 ring-1 ring-white/10">
                          <Video className="h-3 w-3 text-primary" aria-hidden />
                          Meet · 60 phút
                        </span>
                        <span className="text-zinc-500">Thứ 6 · 20:00</span>
                      </div>
                    </div>
                    <ul className="space-y-2 rounded-xl bg-white p-3 text-left text-xs text-zinc-700 shadow-sm ring-1 ring-zinc-200/80">
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                        <span>Gửi tài liệu khung chương trước buổi 24h</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                        <span>Mentor nhận xét trực tiếp trên bản nháp</span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                        <span>Ghi chú buổi lưu trong tài khoản</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-span-12 flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white/95 p-4 shadow-sm backdrop-blur-sm sm:col-span-5 sm:min-h-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-zinc-500">Trải nghiệm buổi đầu</p>
                    <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  </div>
                  <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-zinc-900">
                    {landingStats[3]?.value ?? '95%'}
                  </p>
                  <p className="mt-1 text-sm leading-snug text-zinc-600">{landingStats[3]?.label ?? 'Hài lòng'}</p>
                </div>

                <div className="col-span-12 rounded-2xl border border-dashed border-zinc-300/90 bg-white/60 p-4 backdrop-blur-sm sm:col-span-5">
                  <p className="text-xs font-medium text-zinc-500">Mentor đang mở lịch</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['M', 'T', 'H'].map((initial) => (
                        <span
                          key={initial}
                          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-zinc-100 to-zinc-200 text-xs font-semibold text-zinc-700 shadow-sm"
                        >
                          {initial}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm font-medium text-zinc-800">+ hàng trăm hồ sơ khác</p>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-6 -right-4 hidden h-28 w-28 rounded-3xl bg-primary/15 blur-2xl lg:block" />
            </div>
          </div>
        </Container>
      </section>

      {/* Giới thiệu ngắn — 3 khối */}
      <section
        id="about"
        className={cn('border-b border-border bg-surface-muted py-14 md:py-20', SECTION_SCROLL_MARGIN)}
        aria-labelledby="about-heading"
      >
        <Container>
          <div className="mb-10 max-w-2xl">
            <h2 id="about-heading" className="text-3xl font-black uppercase tracking-tight text-primary md:text-4xl">
              {landingAboutSection.heading}
            </h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-700 md:text-base">
              {landingAboutSection.tagline}
            </p>
          </div>
          <div className="space-y-3">
            {landingAboutBlocks.map((block) => (
              <div
                key={block.number}
                className={cn(
                  'grid min-h-[140px] items-center gap-6 rounded-2xl px-6 py-8 md:grid-cols-[160px_1fr]',
                  block.variant === 'light' && 'border border-border bg-white text-[#1f2a6b]',
                  block.variant === 'dark' && 'bg-[#0f172a] text-white',
                  block.variant === 'accent' && 'bg-primary text-white'
                )}
              >
                <div>
                  <p className="text-3xl font-black uppercase">{block.number}</p>
                  <h3 className="mt-2 text-lg font-extrabold uppercase leading-snug md:text-xl">{block.title}</h3>
                </div>
                <p
                  className={cn(
                    'text-sm leading-relaxed md:text-base',
                    block.variant === 'light' && 'text-[#1f2a6b]/90',
                    block.variant === 'dark' && 'text-white/90',
                    block.variant === 'accent' && 'text-white/95'
                  )}
                >
                  {block.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Cách hoạt động — anchor cho Navbar */}
      <section id="how-it-works" className={cn('py-14 md:py-24', SECTION_SCROLL_MARGIN)}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="text-4xl font-black uppercase leading-none md:text-6xl">
                Vì sao sinh viên
                <span className="block text-primary">chọn Mentoree?</span>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-gray">{landingWhyIntro.lead}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {landingWhyChoose.map((item, idx) => (
                <article
                  key={item.title}
                  className={cn(
                    'rounded-2xl border p-6 transition-colors',
                    item.emphasis
                      ? 'border-primary bg-primary text-white md:row-span-2'
                      : 'border-border bg-white hover:border-border-hover'
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold',
                      item.emphasis ? 'bg-white text-primary' : 'bg-badge-primary-bg text-primary'
                    )}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold leading-snug">{item.title}</h3>
                  <p className={cn('mt-3 text-sm leading-relaxed', item.emphasis ? 'text-white/90' : 'text-gray')}>
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Tính năng */}
      <section
        id="features"
        className={cn('border-y border-border bg-[#0b1220] py-14 text-white md:py-20', SECTION_SCROLL_MARGIN)}
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:items-start">
            <div className="rounded-2xl bg-primary p-6">
              <h3 className="text-2xl font-extrabold uppercase leading-tight md:text-3xl">
                {landingFeaturesIntro.title}
              </h3>
              <p className="mt-3 text-sm text-white/85">{landingFeaturesIntro.body}</p>
              <Link
                href="/register"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-white/90"
              >
                Tạo tài khoản sinh viên
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {landingFeatures.map((f, idx) => (
                <article
                  key={f.title}
                  className="rounded-2xl border border-white/10 bg-white p-5 text-[#111827]"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h4 className="mt-4 text-base font-extrabold">{f.title}</h4>
                  <ul className="mt-3 space-y-2 text-sm text-gray">
                    {f.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ — anchor #faq */}
      <section id="faq" className={cn('py-16 md:py-24', SECTION_SCROLL_MARGIN)}>
        <Container className="max-w-3xl">
          <h2 className="text-center text-3xl font-black tracking-tight md:text-4xl">Câu hỏi thường gặp</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray">{landingFaqSection.subtitle}</p>
          <div className="mt-10 space-y-3">
            {faqs.map((faq, idx) => {
              const open = openFaq === idx;
              return (
                <div
                  key={faq.question}
                  className={cn(
                    'overflow-hidden rounded-2xl border bg-white transition-colors',
                    open ? 'border-primary/40' : 'border-border'
                  )}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
                    onClick={() => setOpenFaq(open ? null : idx)}
                    aria-expanded={open}
                  >
                    <span className={cn('text-sm font-semibold md:text-base', open ? 'text-primary' : 'text-dark')}>
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        open ? 'bg-primary text-white' : 'bg-surface-muted text-gray'
                      )}
                    >
                      {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  {open && (
                    <div className="border-t border-border px-5 pb-5 pt-0 text-sm leading-relaxed text-gray md:px-6 md:pb-6">
                      <p className="pt-4">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA cuối — không lặp footer (AppShell đã có Footer) */}
      <section id="cta" className={cn('border-t border-border bg-dark py-14 text-white md:py-20', SECTION_SCROLL_MARGIN)}>
        <Container className="text-center">
          <h2 className="text-3xl font-black leading-tight md:text-4xl">
            {landingCta.titlePrefix}
            <span className="text-primary">{landingCta.titleHighlight}</span>
            {landingCta.titleSuffix}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/75 md:text-base">{landingCta.body}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/mentors" variant="primary" size="cta">
              {landingCta.primaryLabel}
            </Button>
            <Button href="/register" variant="ghostOnDark" size="cta">
              Đăng ký sinh viên
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};
