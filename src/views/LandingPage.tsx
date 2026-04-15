'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, Heart, ArrowRight, Plus, Minus, Star, Calendar } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(1);
  const [faqCategory, setFaqCategory] = useState('General');

  // Helper arrays for content
  const categories = ['Tất cả', 'Thiết kế', 'Quản lý', 'Kỹ thuật', 'Marketing', 'Sản phẩm', 'Dữ liệu', 'Bán hàng'];
  
  const testimonials = [
    {
      text: "Mentoree thực sự đã thay đổi lộ trình sự nghiệp của tôi. Những kiến thức tôi học được từ mentor của mình là vô giá, giúp tôi đạt được công việc mơ ước.",
      author: "Sarah Jenkins",
      title: "Product Designer @ Spotify",
      bgColor: "bg-[#01B5B4] text-white", // primary cyan
      floatClassName: "mt-0"
    },
    {
      text: "Tìm được mentor trên Mentoree là quyết định nghề nghiệp sáng suốt nhất của tôi. Nó giúp tôi học nhanh hơn và tự tin hơn rất nhiều.",
      author: "Mike Chen",
      title: "Software Engineer @ Google",
      bgColor: "bg-teal-light text-dark",
      floatClassName: "md:mt-12"
    },
    {
      text: "Sau những buổi tư vấn, tôi đã nhận được những lời khuyên rất thực tế. Mentor đã giúp tôi vượt qua những thách thức về quản lý đội ngũ.",
      author: "Elena Rodriguez",
      title: "Engineering Manager @ Stripe",
      bgColor: "bg-purple-light text-dark",
      floatClassName: "mt-0"
    },
    {
      text: "Nền tảng tuyệt vời! Tôi đã dễ dàng tìm thấy một mentor hiểu rõ về sự chuyển dịch nghề nghiệp của mình và hướng dẫn tôi từng bước một.",
      author: "David Kim",
      title: "Data Scientist @ Netflix",
      bgColor: "bg-peach text-dark",
      floatClassName: "md:mt-12"
    }
  ];

  const faqs = [
    { question: "Làm thế nào để tìm được mentor phù hợp với nhu cầu của tôi?", answer: "Bạn có thể sử dụng các bộ lọc tìm kiếm nâng cao của chúng tôi để tìm mentor theo danh mục, chuyên môn, ngôn ngữ và nhiều tiêu chí khác." },
    { question: "Làm thế nào để thanh toán cho một buổi tư vấn?", answer: "Trên nền tảng, bạn có thể thanh toán an toàn qua các loại thẻ tín dụng phổ biến hoặc Stripe. Một số mentor cung cấp buổi tư vấn đầu tiên miễn phí trong khi những người khác có các gói dịch vụ cụ thể." },
    { question: "Tôi có thể hủy buổi tư vấn hoặc nhận lại tiền không?", answer: "Có, bạn có thể hủy tối đa 24 giờ trước buổi tư vấn để được hoàn tiền đầy đủ." },
    { question: "Các buổi tư vấn được thực hiện như thế nào?", answer: "Các buổi tư vấn được thực hiện thông qua tính năng gọi video tích hợp trực tiếp trên nền tảng." },
    { question: "Có giới hạn số lượng mentor mà tôi có thể kết nối không?", answer: "Không, bạn có thể kết nối với bao nhiêu mentor tùy thích để phục vụ nhu cầu học tập của mình." },
  ];

  const mentorCategories = [
    { name: "Dịch vụ Tài chính", count: "145 Mentor sẵn sàng", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800" },
    { name: "Quản trị Nhân sự", count: "89 Mentor sẵn sàng", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" },
    { name: "Nghệ thuật/Sáng tạo", count: "210 Mentor sẵn sàng", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800" }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* Category Sub-Nav */}
      <div className="border-b border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-center items-center gap-8 py-4">
          {categories.map((cat, idx) => (
            <button key={cat} className={cn(
              "text-sm font-bold transition-colors",
              idx === 0 ? "text-primary border-b-2 border-primary pb-1" : "text-gray hover:text-dark"
            )}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Decorative elements/Floating avatars */}
        <div className="absolute top-10 left-10 md:left-20 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xl hidden md:block z-0">
           <img src="https://i.pravatar.cc/100?img=1" alt="floating avatar" />
        </div>
        <div className="absolute top-40 left-4 md:left-40 w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-xl hidden md:block z-0 animate-bounce" style={{animationDuration: '4s'}}>
           <img src="https://i.pravatar.cc/100?img=2" alt="floating avatar" />
        </div>
        <div className="absolute top-60 left-20 w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-xl hidden sm:block z-0">
           <img src="https://i.pravatar.cc/100?img=3" alt="floating avatar" />
        </div>
        <div className="absolute top-20 right-10 md:right-32 w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-xl hidden md:block z-0 animate-bounce" style={{animationDuration: '5s'}}>
           <img src="https://i.pravatar.cc/100?img=4" alt="floating avatar" />
        </div>
        <div className="absolute top-48 right-4 md:right-40 w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xl hidden md:block z-0">
           <img src="https://i.pravatar.cc/100?img=5" alt="floating avatar" />
        </div>
        <div className="absolute bottom-10 right-20 w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-xl hidden md:block z-0 border-[#f2c94c]">
           <img src="https://i.pravatar.cc/100?img=6" alt="floating avatar" />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-[#0D1C2E] tracking-tight mb-6"
          >
            Ai cũng cần một <span className="text-primary relative inline-block">
              Mentor
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-400" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 15 100 5" fill="none" stroke="currentColor" strokeWidth="3"/>
              </svg>
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto"
          >
            Tìm kiếm những chuyên gia hàng đầu để bứt phá sự nghiệp và xây dựng sự tự tin. Nhận lộ trình cá nhân hóa ngay hôm nay.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto bg-white rounded-full p-2 shadow-[0_10px_40px_-10px_rgba(0,196,167,0.2)] border border-gray-100 flex flex-col md:flex-row items-center relative z-20"
          >
            <div className="flex items-center gap-2 px-6 py-4 border-b md:border-b-0 md:border-r border-gray-100 w-full md:w-auto text-dark font-bold whitespace-nowrap cursor-pointer group">
              Chọn danh mục <ChevronDown className="w-5 h-5 text-gray group-hover:text-primary transition-colors" />
            </div>
            <div className="flex items-center flex-1 px-4 py-4 md:py-0 w-full">
              <Search className="w-5 h-5 text-gray mr-3" />
              <input 
                type="text" 
                placeholder="Tìm mentor theo tên, công ty, hoặc vị trí..."
                className="w-full bg-transparent border-none outline-none text-dark placeholder:text-gray-400 font-medium"
              />
            </div>
            <button className="bg-primary text-white font-bold py-4 px-10 rounded-full hover:bg-primary-hover transition-all w-full md:w-auto shadow-lg shadow-primary/30 mt-2 md:mt-0">
              Tìm kiếm
            </button>
          </motion.div>
          
          <div className="mt-8 text-sm text-gray font-bold flex items-center justify-center gap-2 relative z-10">
            Đối tác đáng tin cậy <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-dark mb-4">Đừng chỉ nghe lời chúng tôi nói!</h2>
            <p className="text-gray text-lg font-medium">Hơn 10,000+ người đã đạt được mục tiêu cùng các mentor của chúng tôi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {testimonials.map((test, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-8 rounded-[2rem] shadow-sm flex flex-col justify-between h-80",
                  test.bgColor,
                  test.floatClassName
                )}
              >
                <p className="text-lg font-bold leading-relaxed opacity-90">"{test.text}"</p>
                <div className="flex items-center gap-3 mt-6">
                  <img src={`https://i.pravatar.cc/100?img=${index + 10}`} alt={test.author} className="w-12 h-12 rounded-full border-2 border-white/50" />
                  <div>
                    <h4 className="font-bold text-sm">{test.author}</h4>
                    <p className="text-xs opacity-75">{test.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-12">
            <button className="w-3 h-3 rounded-full bg-primary"></button>
            <button className="w-3 h-3 rounded-full bg-gray-300"></button>
            <button className="w-3 h-3 rounded-full bg-gray-300"></button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center text-dark mb-16">Hoạt động như thế nào?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="bg-[#1A2E44] rounded-[2rem] p-6 mb-8 h-64 relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                <div className="bg-white/10 w-16 h-2 rounded-full mx-auto mb-6"></div>
                
                {/* Mock UI Card */}
                <div className="bg-white rounded-2xl p-4 text-left shadow-lg scale-90 mx-auto max-w-[240px] transform translate-y-4 group-hover:translate-y-2 transition-transform">
                  <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                      <img src="https://i.pravatar.cc/100?img=33" alt="mentor" />
                    </div>
                    <div>
                      <div className="h-3 w-20 bg-gray-200 rounded-full mb-2"></div>
                      <div className="h-2 w-16 bg-gray-100 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-teal-light/50 px-3 py-1 rounded-full text-[10px] text-primary font-bold">Phù hợp</div>
                    <div className="bg-blue-50 px-3 py-1 rounded-full text-[10px] text-blue-500 font-bold">Mentor hàng đầu</div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">1. Tìm kiếm sự phù hợp</h3>
              <p className="text-gray">Duyệt qua hàng nghìn chuyên gia hàng đầu và chọn ra người phù hợp nhất với mục tiêu của bạn.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="bg-[#4169E1] rounded-[2rem] p-6 mb-8 h-64 relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="bg-white/20 w-16 h-2 rounded-full mx-auto mb-6"></div>
                
                {/* Mock UI Card */}
                <div className="bg-white rounded-2xl p-4 text-left shadow-lg scale-90 mx-auto max-w-[240px] transform translate-y-4 group-hover:translate-y-2 transition-transform">
                  <div className="flex justify-between items-center mb-4">
                    <Calendar className="w-6 h-6 text-[#4169E1]" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#4169E1]"></div>
                      <div className="h-2 w-full bg-gray-100 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                      <div className="h-2 w-5/6 bg-gray-100 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                      <div className="bg-[#4169E1] text-white text-[10px] font-bold px-3 py-1 rounded-full w-full text-center">Xác nhận đặt lịch</div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">2. Đặt lịch tư vấn</h3>
              <p className="text-gray">Kiểm tra lịch rảnh của mentor và đặt lịch một cách an toàn, phù hợp với thời gian của bạn.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="bg-[#01B5B4] rounded-[2rem] p-6 mb-8 h-64 relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="bg-white/20 w-16 h-2 rounded-full mx-auto mb-6"></div>
                
                {/* Mock UI Card */}
                <div className="bg-white rounded-2xl p-4 text-left shadow-lg scale-90 mx-auto max-w-[240px] transform translate-y-4 group-hover:translate-y-2 transition-transform relative">
                  <div className="bg-gray-100 rounded-xl h-24 mb-4 overflow-hidden relative">
                     <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="video call" />
                     <div className="absolute bottom-2 right-2 flex gap-1">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white"></div>
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white"></div>
                     </div>
                  </div>
                  <div className="h-2 w-1/2 bg-gray-200 rounded-full mb-2 mx-auto"></div>
                  <div className="h-2 w-1/3 bg-gray-100 rounded-full mx-auto"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">3. Kết nối & Phát triển</h3>
              <p className="text-gray">Gặp gỡ mentor qua video call, đặt câu hỏi và bắt đầu xây dựng lộ trình phát triển của bạn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Split CTA */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/mentors" className="relative group rounded-[2rem] overflow-hidden aspect-[4/3] md:aspect-[16/9] block">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" alt="Tìm mentor" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
              <div className="flex justify-between items-end">
                <h3 className="text-3xl md:text-4xl font-black text-white">Tìm kiếm Mentor</h3>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/register" className="relative group rounded-[2rem] overflow-hidden aspect-[4/3] md:aspect-[16/9] block">
            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200" alt="Trở thành mentor" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
              <div className="flex justify-between items-end">
                <h3 className="text-3xl md:text-4xl font-black text-white">Trở thành Mentor</h3>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24" id="faq">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-center text-dark mb-12">Câu hỏi thường gặp</h2>
          
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {['Chung', 'Cho Mentor', 'Cho Mentee'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setFaqCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-full font-bold text-sm transition-all border",
                  faqCategory === cat ? "bg-primary text-white border-primary" : "bg-white text-gray border-gray-200 hover:border-primary hover:text-primary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-300">
                <button 
                  className="w-full flex justify-between items-center p-6 text-left"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <span className={cn("font-bold text-lg", activeFaq === idx ? "text-primary" : "text-dark")}>
                    {faq.question}
                  </span>
                  {activeFaq === idx ? (
                    <Minus className="w-5 h-5 text-gray flex-shrink-0 ml-4" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray flex-shrink-0 ml-4" />
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
                      <div className="p-6 pt-0 text-gray leading-relaxed border-t border-gray-50 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentor Categories */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center text-dark mb-16">Chọn lĩnh vực Mentor</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentorCategories.map((category, idx) => (
              <Link href="/mentors" key={idx} className="group cursor-pointer">
                <div className="rounded-[2rem] overflow-hidden aspect-[4/3] mb-6 relative shadow-sm">
                  <img src={category.img} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="text-gray text-sm mt-1">{category.count}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-dark group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-sm">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="flex justify-center gap-2 mt-12">
            <button className="w-3 h-3 rounded-full bg-primary"></button>
            <button className="w-3 h-3 rounded-full bg-gray-300"></button>
            <button className="w-3 h-3 rounded-full bg-gray-300"></button>
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto bg-teal-light rounded-[3rem] p-12 md:p-20 text-center relative shadow-sm border border-primary/20">
          
          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-12 h-12 rounded-full overflow-hidden border-2 border-white">
             <img src="https://i.pravatar.cc/100?img=32" alt="floating" />
          </div>
          <div className="absolute bottom-20 left-20 w-16 h-16 rounded-full overflow-hidden border-2 border-white">
             <img src="https://i.pravatar.cc/100?img=12" alt="floating" />
          </div>
          <div className="absolute top-20 right-20 w-14 h-14 rounded-full overflow-hidden border-2 border-white">
             <img src="https://i.pravatar.cc/100?img=42" alt="floating" />
          </div>
          <div className="absolute bottom-10 right-10 w-12 h-12 rounded-full overflow-hidden border-2 border-white">
             <img src="https://i.pravatar.cc/100?img=52" alt="floating" />
          </div>
          
          {/* Dots */}
          <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-blue-300"></div>
          <div className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-red-300"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-dark mb-6 tracking-tight leading-tight">Khám phá hơn 4000+ mentor từ 60+ quốc gia</h2>
            <p className="text-gray text-lg mb-10 font-medium">Mentor phù hợp nhất đang chờ đợi bạn. Nhận hướng dẫn cá nhân từ những người đã từng trải qua hoàn cảnh như bạn.</p>
            <Link href="/mentors" className="btn-primary inline-flex gap-2 items-center text-lg py-4 px-10">
              Tìm kiếm mentor ngay <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          {/* Mentoree faded text in background */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[12vw] font-black tracking-tighter text-white/50 pointer-events-none whitespace-nowrap z-0 select-none">
            mentoree
          </div>
        </div>
      </section>

    </div>
  );
};
