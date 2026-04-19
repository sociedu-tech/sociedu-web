'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Plus, Minus } from 'lucide-react';
import { Button, Container, StatTile } from '@/components/ui';
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
} from '@/views/landing/landingContent';

const SECTION_SCROLL_MARGIN = 'scroll-mt-24 md:scroll-mt-28';

export const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const scrollToHash = () => {
      const raw = window.location.hash;
      if (!raw || raw === '#') return;
      const id = decodeURIComponent(raw.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    scrollToHash();
    const t = window.setTimeout(scrollToHash, 100);
    window.addEventListener('hashchange', scrollToHash);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-dark">
      {/* Hero — đồng bộ màu primary & typography với toàn app */}
      <section
        id="hero"
        className="relative overflow-hidden border-b border-border bg-white pt-8 pb-14 md:pt-12 md:pb-20"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-32 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <Container className="relative z-10">
          <p className="text-center text-[11px] font-bold text-primary">
            {landingHero.eyebrow}
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl text-center text-4xl font-black leading-[1.08] tracking-tight md:text-6xl md:leading-[1.05]">
            {landingHero.titleLine1}
            <br />
            <span
              className="bg-linear-to-br from-primary to-secondary-purple bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {landingHero.titleHighlight}
            </span>{' '}
            {landingHero.titleLine2}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base font-medium leading-relaxed text-gray md:text-lg">
            {landingHero.subtitle}
          </p>

          <div className="mx-auto mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href={landingHero.primaryCta.href} variant="primary" size="pill">
              {landingHero.primaryCta.label}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Button>
            <Button href={landingHero.secondaryCta.href} variant="secondary" size="pill">
              {landingHero.secondaryCta.label}
            </Button>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {landingStats.map((s) => (
              <StatTile key={s.label} value={s.value} label={s.label} />
            ))}
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
