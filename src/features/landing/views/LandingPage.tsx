'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Plus, Minus, Sparkles } from 'lucide-react';
import { MarketingHeroSection } from '@/components/marketing';
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
      {/* Hero — bento + ambient; nền dùng chung MarketingHeroSection (variant default) */}
      <MarketingHeroSection id="hero" variant="default" className="pt-10 pb-16 md:pt-14 md:pb-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:items-center lg:gap-14 xl:gap-16">
            <div className="min-w-0 lg:max-w-xl xl:max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-marketing-border/90 bg-white/90 px-3.5 py-1.5 text-xs font-medium text-marketing-body shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/20" />
                {landingHero.eyebrow}
              </div>

              <h1 className="mt-7 text-balance font-black uppercase tracking-tight text-marketing-fg">
                <span className="block text-[1.35rem] leading-snug text-marketing-fg-muted sm:text-2xl md:text-[1.75rem]">
                  {landingHero.titleLine1}
                </span>
                <span className="mt-3 block text-[2rem] leading-[1.12] sm:text-[2.35rem] sm:leading-[1.1] md:text-[2.65rem] lg:text-[2.85rem]">
                  <span
                    className="bg-linear-to-br from-primary via-primary to-secondary-purple bg-clip-text text-transparent"
                    style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    {landingHero.titleHighlight}
                  </span>{' '}
                  <span className="text-marketing-fg-strong">{landingHero.titleLine2}</span>
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-marketing-body md:text-lg">
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
                  className="w-full border-marketing-border bg-white/90 sm:w-auto"
                >
                  {landingHero.secondaryCta.label}
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-marketing-border/80 pt-8">
                {landingStats.map((s) => (
                  <div key={s.label} className="min-w-[calc(50%-0.75rem)] sm:min-w-0">
                    <p className="text-lg font-semibold tabular-nums tracking-tight text-marketing-fg md:text-xl">
                      {s.value}
                    </p>
                    <p className="mt-0.5 text-sm leading-snug text-marketing-fg-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
              <div className="grid grid-cols-12 gap-3 sm:grid-rows-2 sm:gap-4">
                <figure className="relative z-10 col-span-12 aspect-[4/3] min-h-[200px] overflow-hidden rounded-2xl border border-marketing-card-border bg-marketing-panel shadow-marketing-bento sm:col-span-7 sm:row-span-2 sm:aspect-auto sm:min-h-[320px]">
                  <Image
                    src="/banner.jpg"
                    alt="Mentor đồng hành cùng sinh viên trong buổi kèm 1-1 tại không gian làm việc hiện đại"
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 42vw"
                    className="object-cover object-[center_25%] sm:object-[58%_center]"
                  />
                  <figcaption className="sr-only">Hình minh hoạ mentor hướng dẫn trực tiếp trên máy tính</figcaption>
                  <div
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent sm:from-black/30"
                    aria-hidden
                  />
                  <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-marketing-fg-strong shadow-sm ring-1 ring-black/5 sm:left-4 sm:top-4 sm:text-[11px]">
                    Kèm 1-1 thực tế
                  </div>
                </figure>

                <div className="col-span-12 flex flex-col justify-between rounded-2xl border border-marketing-card-border/90 bg-white/95 p-4 shadow-sm backdrop-blur-sm sm:col-span-5 sm:min-h-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-marketing-fg-muted">Trải nghiệm buổi đầu</p>
                    <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  </div>
                  <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-marketing-fg">
                    {landingStats[3]?.value ?? '95%'}
                  </p>
                  <p className="mt-1 text-sm leading-snug text-marketing-body">{landingStats[3]?.label ?? 'Hài lòng'}</p>
                </div>

                <div className="col-span-12 rounded-2xl border border-dashed border-marketing-border-dashed/90 bg-white/60 p-4 backdrop-blur-sm sm:col-span-5">
                  <p className="text-xs font-medium text-marketing-fg-muted">Mentor đang mở lịch</p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['M', 'T', 'H'].map((initial) => (
                        <span
                          key={initial}
                          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-marketing-avatar-from to-marketing-avatar-to text-xs font-semibold text-marketing-avatar-text shadow-sm"
                        >
                          {initial}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm font-medium text-marketing-fg-strong">+ hàng trăm hồ sơ khác</p>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-6 -right-4 hidden h-28 w-28 rounded-3xl bg-primary/15 blur-2xl lg:block" />
            </div>
          </div>
        </Container>
      </MarketingHeroSection>

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
