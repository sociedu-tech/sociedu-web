'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, Heart, ArrowRight, Plus, Minus, Star, Calendar } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { categories, testimonials, faqs, mentorCategories } from '@/views/landing/landingContent';

const FLOATING_AVATARS = [
  { className: 'absolute top-10 left-10 md:left-20 w-12 h-12 hidden md:block z-0', src: 'https://i.pravatar.cc/100?img=1', size: 48 as const },
  {
    className: 'absolute top-40 left-4 md:left-40 w-16 h-16 hidden md:block z-0 animate-bounce',
    src: 'https://i.pravatar.cc/100?img=2',
    size: 64 as const,
    style: { animationDuration: '4s' } as React.CSSProperties,
  },
  { className: 'absolute top-60 left-20 w-10 h-10 hidden sm:block z-0', src: 'https://i.pravatar.cc/100?img=3', size: 40 as const },
  {
    className: 'absolute top-20 right-10 md:right-32 w-14 h-14 hidden md:block z-0 animate-bounce',
    src: 'https://i.pravatar.cc/100?img=4',
    size: 56 as const,
    style: { animationDuration: '5s' } as React.CSSProperties,
  },
  { className: 'absolute top-48 right-4 md:right-40 w-12 h-12 hidden md:block z-0', src: 'https://i.pravatar.cc/100?img=5', size: 48 as const },
  {
    className: 'absolute bottom-10 right-20 w-20 h-20 hidden md:block z-0 border-accent-yellow',
    src: 'https://i.pravatar.cc/100?img=6',
    size: 80 as const,
  },
];

export const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(1);
  const [faqCategory, setFaqCategory] = useState('Chung');
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-border hidden md:block">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-center items-center gap-5 py-3 flex-wrap">
          {categories.map((cat, idx) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategoryIdx(idx)}
              className={cn(
                'text-[10px] uppercase tracking-[1px] font-medium transition-colors',
                idx === activeCategoryIdx
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-gray hover:text-dark'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* <p className="text-center text-xs text-gray-400 pb-3 max-w-xl mx-auto px-4">
          {activeCategoryIdx === 0
            ? 'Bộ lọc danh mục đang được hoàn thiện — hiện hiển thị tất cả lĩnh vực.'
            : `Bạn đã chọn “${categories[activeCategoryIdx]}”. Áp dụng lọc đầy đủ trên trang Tìm mentor.`}
        </p> */}
      </div>

      <section className="relative pt-14 pb-16 md:pt-16 md:pb-20 overflow-hidden">
        {FLOATING_AVATARS.map((item, i) => (
          <div
            key={item.src + i}
            className={cn(
              'rounded-full overflow-hidden border-2 border-white shadow-xl',
              item.className
            )}
            style={item.style}
          >
            <Image
              src={item.src}
              alt=""
              width={item.size}
              height={item.size}
              className="object-cover"
              sizes={`${item.size}px`}
            />
          </div>
        ))}

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-[80px] font-semibold leading-[1.04] tracking-[-0.8px] text-dark mb-5"
          >
            Ai cũng cần một{' '}
            <span className="text-primary relative inline-block">
              Mentor
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-secondary-yellow"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path d="M0 5 Q 50 15 100 5" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-700 text-base md:text-[20px] font-medium leading-[1.5] mb-8 max-w-2xl mx-auto"
          >
            Tìm kiếm những chuyên gia hàng đầu để bứt phá sự nghiệp và xây dựng sự tự tin. Nhận lộ trình cá nhân hóa ngay hôm nay.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto bg-white rounded-[8px] p-1.5 shadow-search-accent border border-border flex flex-col md:flex-row items-center relative z-20"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b md:border-b-0 md:border-r border-border w-full md:w-auto text-dark text-sm font-medium whitespace-nowrap cursor-pointer group">
              Chọn danh mục{' '}
              <ChevronDown className="w-4 h-4 text-gray group-hover:text-primary transition-colors" aria-hidden />
            </div>
            <div className="flex items-center flex-1 px-3 py-3 md:py-0 w-full">
              <Search className="w-4 h-4 text-gray mr-2.5 shrink-0" aria-hidden />
              <input
                type="search"
                name="mentor-search"
                placeholder="Tìm mentor theo tên, công ty, hoặc vị trí..."
                className="w-full bg-transparent border-none outline-none text-dark placeholder:text-gray-300 font-medium"
                autoComplete="off"
              />
            </div>
            <Link
              href="/mentors"
              className="btn-primary w-full md:w-auto mt-2 md:mt-0 text-center"
            >
              Tìm kiếm
            </Link>
          </motion.div>

          <div className="mt-6 text-[10px] uppercase tracking-[1px] text-gray font-medium flex items-center justify-center gap-2 relative z-10">
            Đối tác đáng tin cậy <ArrowRight className="w-4 h-4" aria-hidden />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-surface-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <div className="w-9 h-9 bg-secondary-red/10 text-secondary-red rounded-[4px] flex items-center justify-center mx-auto mb-3">
              <Heart className="w-4 h-4 fill-current" aria-hidden />
            </div>
            <h2 className="text-[32px] md:text-[56px] font-semibold leading-[1.04] text-dark mb-3">Đừng chỉ nghe lời chúng tôi nói!</h2>
            <p className="text-gray text-base md:text-xl font-medium leading-[1.5]">Hơn 10,000+ người đã đạt được mục tiêu cùng các mentor của chúng tôi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 px-2 md:px-4">
            {testimonials.map((test, index) => (
              <motion.div
                key={test.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'p-6 rounded-[8px] border border-border shadow-glass flex flex-col justify-between min-h-[17rem] md:h-72',
                  test.bgColor,
                  test.floatClassName
                )}
              >
                <p className="text-sm md:text-base font-semibold leading-relaxed opacity-90">&ldquo;{test.text}&rdquo;</p>
                <div className="flex items-center gap-3 mt-6">
                  <Image
                    src={`https://i.pravatar.cc/100?img=${index + 10}`}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white/50 object-cover"
                    sizes="40px"
                  />
                  <div>
                    <h3 className="font-semibold text-xs">{test.author}</h3>
                    <p className="text-[11px] opacity-75">{test.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8" aria-hidden>
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="w-2 h-2 rounded-full bg-gray-300" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-[32px] md:text-[56px] font-semibold leading-[1.04] text-center text-dark mb-10 md:mb-12">Hoạt động như thế nào?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center group">
              <div className="bg-feature-navy rounded-[8px] p-5 mb-6 h-56 md:h-60 relative overflow-hidden group-hover:-translate-y-1 transition-transform duration-300 shadow-glass">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                <div className="bg-white/10 w-16 h-2 rounded-full mx-auto mb-6" />
                <div className="bg-white rounded-[8px] p-4 text-left shadow-lg scale-90 mx-auto max-w-[240px] transform translate-y-4 group-hover:translate-y-2 transition-transform">
                  <div className="flex items-center gap-3 mb-4 border-b border-border pb-4">
                    <div className="relative w-12 h-12 bg-gray-100 rounded-full overflow-hidden shrink-0">
                      <Image src="https://i.pravatar.cc/100?img=33" alt="" fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <div className="h-3 w-20 bg-gray-200 rounded-full mb-2" />
                      <div className="h-2 w-16 bg-gray-100 rounded-full" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-badge-primary-bg px-3 py-1 rounded-[4px] text-[10px] uppercase tracking-[1px] text-primary font-bold">Phù hợp</div>
                    <div className="bg-blue-light px-3 py-1 rounded-[4px] text-[10px] uppercase tracking-[1px] text-primary font-bold">Mentor hàng đầu</div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-medium text-dark mb-1.5">1. Tìm kiếm sự phù hợp</h3>
              <p className="text-gray text-base leading-[1.5]">
                Duyệt qua hàng nghìn chuyên gia hàng đầu và chọn ra người phù hợp nhất với mục tiêu của bạn.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-feature-blue rounded-[8px] p-5 mb-6 h-56 md:h-60 relative overflow-hidden group-hover:-translate-y-1 transition-transform duration-300 shadow-glass">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="bg-white/20 w-16 h-2 rounded-full mx-auto mb-6" />
                <div className="bg-white rounded-[8px] p-4 text-left shadow-lg scale-90 mx-auto max-w-[240px] transform translate-y-4 group-hover:translate-y-2 transition-transform">
                  <div className="flex justify-between items-center mb-4">
                    <Calendar className="w-6 h-6 text-feature-blue" aria-hidden />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" aria-hidden />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-feature-blue" />
                      <div className="h-2 w-full bg-gray-100 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-200" />
                      <div className="h-2 w-5/6 bg-gray-100 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                      <div className="bg-feature-blue text-white text-[10px] font-bold px-3 py-1 rounded-[4px] w-full text-center">
                        Xác nhận đặt lịch
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-medium text-dark mb-1.5">2. Đặt lịch tư vấn</h3>
              <p className="text-gray text-base leading-[1.5]">
                Kiểm tra lịch rảnh của mentor và đặt lịch một cách an toàn, phù hợp với thời gian của bạn.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-primary rounded-[8px] p-5 mb-6 h-56 md:h-60 relative overflow-hidden group-hover:-translate-y-1 transition-transform duration-300 shadow-glass">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="bg-white/20 w-16 h-2 rounded-full mx-auto mb-6" />
                <div className="bg-white rounded-[8px] p-4 text-left shadow-lg scale-90 mx-auto max-w-[240px] transform translate-y-4 group-hover:translate-y-2 transition-transform relative">
                  <div className="bg-gray-100 rounded-[8px] h-24 mb-4 overflow-hidden relative">
                    <Image
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
                      alt=""
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white" />
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white" />
                    </div>
                  </div>
                  <div className="h-2 w-1/2 bg-gray-200 rounded-full mb-2 mx-auto" />
                  <div className="h-2 w-1/3 bg-gray-100 rounded-full mx-auto" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-dark mb-1.5">3. Kết nối & Phát triển</h3>
              <p className="text-gray text-base leading-[1.5]">
                Gặp gỡ mentor qua video call, đặt câu hỏi và bắt đầu xây dựng lộ trình phát triển của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <Link
            href="/mentors"
            className="relative group rounded-[8px] overflow-hidden aspect-[4/3] md:aspect-video block border border-border shadow-glass"
          >
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
              alt="Nhóm làm việc — tìm mentor phù hợp"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
              <div className="flex justify-between items-end gap-3">
                <h3 className="text-2xl md:text-[32px] font-semibold text-white leading-[1.3]">Tìm kiếm Mentor</h3>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 text-dark group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowRight className="w-5 h-5" aria-hidden />
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/register"
            className="relative group rounded-[8px] overflow-hidden aspect-[4/3] md:aspect-video block border border-border shadow-glass"
          >
            <Image
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200"
              alt="Làm việc cùng mentor — trở thành mentor"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
              <div className="flex justify-between items-end gap-3">
                <h3 className="text-2xl md:text-[32px] font-semibold text-white leading-[1.3]">Trở thành Mentor</h3>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 text-dark group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowRight className="w-5 h-5" aria-hidden />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="py-16 md:py-20" id="faq">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-[32px] md:text-[56px] font-semibold leading-[1.04] text-center text-dark mb-8 md:mb-10">Câu hỏi thường gặp</h2>

          <div className="flex justify-center gap-2 md:gap-3 mb-8 flex-wrap">
            {['Chung', 'Cho Mentor', 'Cho Mentee'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFaqCategory(cat)}
                className={cn(
                  'px-4 py-1.5 rounded-[4px] font-medium text-xs md:text-sm transition-all border',
                  faqCategory === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray border-border hover:border-primary hover:text-primary'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={faq.question}
                className="border border-border rounded-[8px] bg-white overflow-hidden transition-all duration-300 shadow-glass"
              >
                <button
                  type="button"
                  className="w-full flex justify-between items-center p-4 md:p-5 text-left"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  aria-expanded={activeFaq === idx}
                >
                  <span className={cn('font-semibold text-sm md:text-base pr-3', activeFaq === idx ? 'text-primary' : 'text-dark')}>
                    {faq.question}
                  </span>
                  {activeFaq === idx ? (
                    <Minus className="w-4 h-4 text-gray shrink-0" aria-hidden />
                  ) : (
                    <Plus className="w-4 h-4 text-gray shrink-0" aria-hidden />
                  )}
                </button>

                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 md:p-5 pt-0 text-base text-gray leading-[1.5] border-t border-border mt-1">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-surface-muted">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-[32px] md:text-[56px] font-semibold leading-[1.04] text-center text-dark mb-10 md:mb-12">Chọn lĩnh vực Mentor</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mentorCategories.map((category, idx) => (
              <Link href="/mentors" key={category.name} className="group cursor-pointer">
                <div className="rounded-[8px] overflow-hidden aspect-[4/3] mb-4 relative border border-border shadow-glass">
                  <Image
                    src={category.img}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="text-xl font-medium text-dark group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="text-gray text-sm mt-0.5">{category.count}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-dark group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-glass shrink-0">
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8" aria-hidden>
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            <span className="w-2 h-2 rounded-full bg-gray-300" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto bg-blue-light rounded-[8px] p-8 md:p-12 text-center relative shadow-glass border border-border">
          <div className="absolute top-10 left-10 w-12 h-12 rounded-full overflow-hidden border-2 border-white hidden sm:block">
            <Image src="https://i.pravatar.cc/100?img=32" alt="" width={48} height={48} className="object-cover" sizes="48px" />
          </div>
          <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full overflow-hidden border-2 border-white hidden md:block">
            <Image src="https://i.pravatar.cc/100?img=12" alt="" width={64} height={64} className="object-cover" sizes="64px" />
          </div>
          <div className="absolute top-20 right-20 w-14 h-14 rounded-full overflow-hidden border-2 border-white hidden md:block">
            <Image src="https://i.pravatar.cc/100?img=42" alt="" width={56} height={56} className="object-cover" sizes="56px" />
          </div>
          <div className="absolute bottom-10 right-10 w-12 h-12 rounded-full overflow-hidden border-2 border-white hidden sm:block">
            <Image src="https://i.pravatar.cc/100?img=52" alt="" width={48} height={48} className="object-cover" sizes="48px" />
          </div>

          <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-blue-300" aria-hidden />
          <div className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-secondary-yellow" aria-hidden />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-secondary-pink/60" aria-hidden />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-[32px] md:text-[56px] font-semibold text-dark mb-4 tracking-tight leading-[1.04]">
              Khám phá hơn 4000+ mentor từ 60+ quốc gia
            </h2>
            <p className="text-gray text-base md:text-xl mb-8 font-medium leading-[1.5] max-w-xl mx-auto">
              Mentor phù hợp nhất đang chờ đợi bạn. Nhận hướng dẫn cá nhân từ những người đã từng trải qua hoàn cảnh như bạn.
            </p>
            <Link href="/mentors" className="btn-primary inline-flex gap-2 items-center text-sm py-2.5 px-8">
              Tìm kiếm mentor ngay <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>

          <div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10vw] md:text-[9vw] font-semibold tracking-tighter text-primary/10 pointer-events-none whitespace-nowrap z-0 select-none"
            aria-hidden
          >
            mentoree
          </div>
        </div>
      </section>
    </div>
  );
};
