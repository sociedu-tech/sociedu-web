'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ChevronDown,
  ArrowRight,
  Plus,
  Minus,
  Star,
  Users,
  Globe,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { categories, testimonials, faqs, mentorCategories } from '@/views/landing/landingContent';

function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6', className)}>{children}</div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-badge-primary-bg px-3.5 py-1 text-[11px] font-bold tracking-[0.8px] text-primary uppercase mb-5">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      {children}
    </div>
  );
}

const STATS = [
  { value: '4,000+', label: 'Mentor chuyên gia', icon: <Users className="w-4 h-4" /> },
  { value: '60+', label: 'Quốc gia', icon: <Globe className="w-4 h-4" /> },
  { value: '50K+', label: 'Mentee hài lòng', icon: <Star className="w-4 h-4 fill-current" /> },
  { value: '98%', label: 'Đánh giá tích cực', icon: <ShieldCheck className="w-4 h-4" /> },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Tìm kiếm Mentor phù hợp',
    desc: 'Duyệt qua hàng nghìn chuyên gia, lọc theo lĩnh vực, kỹ năng và mức giá. Đọc đánh giá thực từ mentee đã trải nghiệm.',
    color: 'from-blue-50 to-indigo-50',
    accent: 'bg-primary',
    icon: <Search className="w-5 h-5 text-white" />,
  },
  {
    step: '02',
    title: 'Đặt lịch tư vấn',
    desc: 'Kiểm tra lịch rảnh theo thời gian thực, đặt lịch và thanh toán an toàn chỉ trong vài bước đơn giản.',
    color: 'from-violet-50 to-purple-50',
    accent: 'bg-secondary-purple',
    icon: <Zap className="w-5 h-5 text-white" />,
  },
  {
    step: '03',
    title: 'Kết nối & Phát triển',
    desc: 'Tham gia video call, nhận lộ trình cá nhân hóa và theo dõi tiến độ phát triển của bạn theo từng buổi.',
    color: 'from-emerald-50 to-teal-50',
    accent: 'bg-secondary-green',
    icon: <CheckCircle2 className="w-5 h-5 text-white" />,
  },
];

export const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState('Chung');
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky category rail */}
      <div className="border-b border-border bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80 sticky top-[56px] md:top-[60px] z-40">
        <Container className="py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat, idx) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategoryIdx(idx)}
                className={cn(
                  'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200',
                  idx === activeCategoryIdx
                    ? 'border-primary bg-primary text-white shadow-sm'
                    : 'border-border bg-white text-gray hover:border-border-hover hover:text-dark'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Background mesh gradient */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-secondary-purple/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-secondary-yellow/10 blur-3xl" />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(#146ef5 1px, transparent 1px), linear-gradient(90deg, #146ef5 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }}
          />
        </div>

        <Container className="relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-badge-primary-bg px-4 py-1.5 text-xs font-semibold text-primary mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Hơn 200 mentor mới tham gia tuần này
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="text-5xl font-bold leading-[1.04] tracking-[-1.5px] text-dark md:text-7xl"
            >
              Ai cũng xứng đáng có
              <br />
              <span
                className="relative inline-block"
                style={{
                  background: 'linear-gradient(135deg, #146ef5 0%, #7a3dff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                một người thầy
              </span>
              &nbsp;tốt.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-6 text-lg font-medium leading-relaxed text-gray max-w-2xl mx-auto md:text-xl"
            >
              Kết nối với chuyên gia đã trải nghiệm thực tế, nhận lộ trình cá nhân hóa và bứt phá
              mục tiêu học tập — sự nghiệp của bạn.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mx-auto mt-10 max-w-3xl"
            >
              <div className="rounded-2xl border border-border bg-white p-2 shadow-[0_8px_40px_-8px_rgba(20,110,245,0.18)] flex flex-col gap-2 md:flex-row md:items-center">
                <button
                  type="button"
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-gray-50 px-4 py-3 text-sm font-semibold text-dark hover:border-border-hover transition-colors md:w-52 shrink-0"
                >
                  <span className="truncate">{categories[activeCategoryIdx] ?? 'Tất cả'}</span>
                  <ChevronDown className="h-4 w-4 text-gray shrink-0" aria-hidden />
                </button>

                <div className="flex items-center flex-1 rounded-xl border border-border bg-gray-50 px-4 py-3">
                  <Search className="h-4 w-4 shrink-0 text-gray" aria-hidden />
                  <input
                    type="search"
                    name="mentor-search"
                    placeholder="Tên mentor, công ty, kỹ năng…"
                    className="ml-3 w-full bg-transparent outline-none text-dark placeholder:text-gray-300 text-sm font-medium"
                    autoComplete="off"
                  />
                </div>

                <Link
                  href="/mentors"
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-hover transition-colors shrink-0 shadow-button-primary"
                >
                  Tìm Mentor <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust chips */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-gray">
                {['Mentor được xét duyệt', 'Thanh toán bảo mật', 'Đặt lịch dễ dàng', 'Hỗ trợ 24/7'].map(
                  (item) => (
                    <span key={item} className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      {item}
                    </span>
                  )
                )}
              </div>
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mx-auto mt-16 max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="text-center rounded-2xl border border-border bg-white/80 backdrop-blur px-4 py-5 shadow-sm"
              >
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1.5">
                  {s.icon}
                </div>
                <div className="text-2xl font-bold text-dark tracking-tight">{s.value}</div>
                <div className="text-xs text-gray mt-0.5 font-medium">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ── SOCIAL PROOF / TESTIMONIALS ── */}
      <section className="py-20 md:py-28 bg-surface-muted">
        <Container>
          <div className="text-center mb-14">
            <SectionLabel>Câu chuyện thật</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-dark leading-[1.1]">
              Hàng nghìn người đã thay đổi
              <br />
              <span className="text-primary">sự nghiệp</span> nhờ Mentoree
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((test, index) => (
              <motion.div
                key={test.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={cn(
                  'relative p-6 rounded-2xl flex flex-col justify-between min-h-64 border',
                  test.bgColor === 'bg-primary text-white'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-dark border-border shadow-sm',
                  index % 2 === 1 ? 'md:mt-8' : ''
                )}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-3.5 h-3.5 fill-current',
                        test.bgColor === 'bg-primary text-white' ? 'text-yellow-300' : 'text-yellow-400'
                      )}
                    />
                  ))}
                </div>

                <p
                  className={cn(
                    'text-sm leading-relaxed flex-1',
                    test.bgColor === 'bg-primary text-white' ? 'text-white/90' : 'text-gray-700'
                  )}
                >
                  &ldquo;{test.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/20">
                  <Image
                    src={`https://i.pravatar.cc/100?img=${index + 10}`}
                    alt=""
                    width={36}
                    height={36}
                    className="rounded-full object-cover ring-2 ring-white/30"
                    sizes="36px"
                  />
                  <div>
                    <p className="font-bold text-xs leading-tight">{test.author}</p>
                    <p
                      className={cn(
                        'text-[11px] mt-0.5',
                        test.bgColor === 'bg-primary text-white' ? 'text-white/60' : 'text-gray'
                      )}
                    >
                      {test.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 md:py-28 bg-white" id="how-it-works">
        <Container>
          <div className="text-center mb-14">
            <SectionLabel>Cách hoạt động</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-dark leading-[1.1]">
              Bắt đầu chỉ trong{' '}
              <span className="text-primary">3 bước</span>
            </h2>
            <p className="mt-4 text-lg text-gray max-w-xl mx-auto font-medium">
              Từ tìm kiếm đến buổi học đầu tiên — đơn giản, nhanh chóng và an toàn.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-8 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-gradient-to-r from-transparent via-border to-transparent"
              aria-hidden
            />

            {HOW_IT_WORKS.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12 }}
                className="group"
              >
                {/* Step number badge */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300',
                      step.accent
                    )}
                  >
                    {step.icon}
                  </div>
                  <span className="text-5xl font-black text-gray-100 leading-none select-none group-hover:text-gray-200 transition-colors">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray text-base leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── QUICK CTAs ── */}
      <section className="py-12 md:py-16 bg-surface-muted">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link
              href="/mentors"
              className="relative group rounded-2xl overflow-hidden block aspect-video border border-border"
            >
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                alt="Tìm mentor"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-9">
                <div className="inline-flex items-center gap-1.5 text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">
                  Dành cho Mentee
                </div>
                <div className="flex justify-between items-end gap-3">
                  <h3 className="text-2xl md:text-[30px] font-bold text-white leading-tight">
                    Tìm kiếm Mentor
                    <br />
                    <span className="text-white/70 font-medium text-lg">phù hợp với bạn</span>
                  </h3>
                  <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg">
                    <ArrowRight className="w-5 h-5 text-dark group-hover:text-white transition-colors" aria-hidden />
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/register"
              className="relative group rounded-2xl overflow-hidden block aspect-video border border-border"
            >
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200"
                alt="Trở thành Mentor"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-9">
                <div className="inline-flex items-center gap-1.5 text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">
                  Dành cho Mentor
                </div>
                <div className="flex justify-between items-end gap-3">
                  <h3 className="text-2xl md:text-[30px] font-bold text-white leading-tight">
                    Trở thành Mentor
                    <br />
                    <span className="text-white/70 font-medium text-lg">chia sẻ kinh nghiệm</span>
                  </h3>
                  <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-lg">
                    <ArrowRight className="w-5 h-5 text-dark group-hover:text-white transition-colors" aria-hidden />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      {/* ── MENTOR CATEGORIES ── */}
      <section className="py-20 md:py-28 bg-white">
        <Container>
          <div className="text-center mb-14">
            <SectionLabel>Lĩnh vực</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-dark leading-[1.1]">
              Khám phá mentor theo{' '}
              <span className="text-primary">chuyên ngành</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mentorCategories.map((category, idx) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href="/mentors" className="group block">
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4 relative border border-border">
                    <Image
                      src={category.img}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-dark group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray mt-0.5">{category.count}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-surface-muted border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shrink-0">
                      <ArrowRight className="w-4 h-4" aria-hidden />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28 bg-surface-muted" id="faq">
        <Container className="max-w-4xl">
          <div className="text-center mb-12">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-dark leading-[1.1]">
              Câu hỏi thường gặp
            </h2>
            <p className="mt-4 text-lg text-gray max-w-lg mx-auto font-medium">
              Chưa chắc? Những câu hỏi phổ biến dưới đây sẽ giúp bạn hiểu rõ hơn.
            </p>
          </div>

          <div className="flex justify-center gap-2 flex-wrap mb-8">
            {['Chung', 'Cho Mentor', 'Cho Mentee'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFaqCategory(cat)}
                className={cn(
                  'px-5 py-2 rounded-full font-semibold text-sm transition-all border',
                  faqCategory === cat
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-gray border-border hover:border-primary hover:text-primary'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.question}
                className={cn(
                  'border rounded-2xl bg-white overflow-hidden transition-all duration-300',
                  activeFaq === idx ? 'border-primary/30 shadow-sm' : 'border-border'
                )}
              >
                <button
                  type="button"
                  className="w-full flex justify-between items-center p-5 md:p-6 text-left gap-4"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  aria-expanded={activeFaq === idx}
                >
                  <span
                    className={cn(
                      'font-semibold text-sm md:text-base',
                      activeFaq === idx ? 'text-primary' : 'text-dark'
                    )}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors',
                      activeFaq === idx ? 'bg-primary text-white' : 'bg-surface-muted text-gray'
                    )}
                  >
                    {activeFaq === idx ? (
                      <Minus className="w-3.5 h-3.5" aria-hidden />
                    ) : (
                      <Plus className="w-3.5 h-3.5" aria-hidden />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 md:px-6 md:pb-6 text-base text-gray leading-relaxed border-t border-border/60 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <Container>
          <div className="relative rounded-3xl overflow-hidden bg-dark text-white p-10 md:p-16 text-center">
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-secondary-purple/20 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full bg-primary/10 blur-3xl" />
            </div>

            {/* Floating avatars */}
            {[
              { src: 32, pos: 'top-6 left-6 sm:top-10 sm:left-10', size: 48 },
              { src: 12, pos: 'bottom-6 left-16 sm:bottom-10 sm:left-24', size: 56 },
              { src: 42, pos: 'top-10 right-20 sm:top-14 sm:right-28', size: 52 },
              { src: 52, pos: 'bottom-6 right-6 sm:bottom-10 sm:right-10', size: 48 },
            ].map(({ src, pos, size }) => (
              <div
                key={src}
                className={cn('absolute rounded-full overflow-hidden border-2 border-white/30 hidden sm:block', pos)}
                style={{ width: size, height: size }}
                aria-hidden
              >
                <Image
                  src={`https://i.pravatar.cc/100?img=${src}`}
                  alt=""
                  width={size}
                  height={size}
                  className="object-cover"
                  sizes={`${size}px`}
                />
              </div>
            ))}

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 mb-6 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-green" />
                Đang có mentor trực tuyến
              </div>

              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.06] mb-5">
                Bắt đầu hành trình
                <br />
                của bạn{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #146ef5 0%, #7a3dff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  ngay hôm nay
                </span>
                .
              </h2>

              <p className="text-white/60 text-lg font-medium max-w-lg mx-auto mb-10 leading-relaxed">
                Hơn 4,000 mentor từ 60+ quốc gia đang chờ hướng dẫn bạn. Đặt lịch buổi đầu tiên miễn phí.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/mentors"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white hover:bg-primary-hover transition-colors shadow-button-primary"
                >
                  Tìm Mentor ngay <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-colors"
                >
                  Đăng ký miễn phí
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
