'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useRegisterPage } from '@/features/auth/hooks';
import { MarketingHeroSection } from '@/components/marketing';

export function RegisterPage() {
  const {
    loading,
    error,
    success,
    registeredEmail,
    resendLoading,
    resendMessage,
    fieldErrors,
    isAuthenticated,
    handleSubmit,
    handleResendVerification,
    goToLogin,
    resetRegistration,
  } = useRegisterPage();

  if (isAuthenticated) {
    return (
      <MarketingHeroSection variant="dawn" className="flex min-h-screen items-center justify-center border-b-0">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </MarketingHeroSection>
    );
  }

  const inputFocusClass =
    'w-full pl-12 pr-4 py-3 bg-white border border-border rounded-[4px] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm transition-all';

  return (
    <MarketingHeroSection variant="dawn" className="flex min-h-screen flex-col items-center justify-center p-4 border-b-0">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[8px] border border-border bg-white lg:grid-cols-2">

        <div className="hidden lg:flex flex-col justify-between p-10 bg-dark text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-400/40 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight mb-6">
              Bắt đầu hành trình <br />
              <span className="text-primary">cùng mentor.</span>
            </h1>
            <p className="text-gray-300 text-base font-medium max-w-md">
              Tạo tài khoản để tìm mentor, đặt lịch và theo dõi tiến độ học tập — an toàn và minh bạch.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <CheckCircle2 className="text-primary w-5 h-5" />
              </div>
              <p className="font-bold">Lộ trình gợi ý theo mục tiêu của bạn</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <CheckCircle2 className="text-primary w-5 h-5" />
              </div>
              <p className="font-bold">Mentor từ nhiều lĩnh vực và trường đại học</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <CheckCircle2 className="text-primary w-5 h-5" />
              </div>
              <p className="font-bold">Hỗ trợ xác minh email và bảo mật tài khoản</p>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-10 flex flex-col justify-center">
          {success ? (
            <div className="max-w-md mx-auto w-full">
              <div className="mb-6 text-center">
                <Mail className="mx-auto h-10 w-10 text-primary" strokeWidth={1.5} aria-hidden />
                <h2 className="mt-4 text-xl font-semibold text-dark">Mở email và xác minh</h2>
                <p className="mt-2 text-sm text-gray leading-relaxed">
                  Đã gửi liên kết kích hoạt tới{' '}
                  <span className="font-medium text-dark break-all">{registeredEmail}</span>. Kiểm tra cả thư mục Spam.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={resendLoading}
                  onClick={handleResendVerification}
                  className="flex-1 px-4 py-3 rounded-[8px] border border-border bg-white text-dark font-semibold text-sm hover:bg-page transition-colors disabled:opacity-60"
                >
                  {resendLoading ? 'Đang gửi lại…' : 'Gửi lại email xác minh'}
                </button>
                <button
                  type="button"
                  onClick={goToLogin}
                  className="flex-1 px-4 py-3 rounded-[8px] btn-primary text-sm font-semibold"
                >
                  Đăng nhập
                </button>
              </div>

              {resendMessage && (
                <div className="mt-4 flex items-start gap-2 rounded-[8px] border border-emerald-100 bg-emerald-50/80 px-3 py-2.5 text-sm text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" aria-hidden />
                  <span className="font-medium leading-snug">{resendMessage}</span>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 rounded-[8px] border border-red-100 flex items-center gap-2 text-red-600 text-sm font-semibold">
                  <AlertCircle size={16} aria-hidden /> {error}
                </div>
              )}

              <p className="mt-8 text-center text-sm text-gray font-medium">
                Sai email?{' '}
                <button
                  type="button"
                  onClick={resetRegistration}
                  className="text-primary font-semibold hover:underline"
                >
                  Đăng ký lại
                </button>
              </p>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h2 className="text-3xl md:text-4xl font-semibold leading-[1.1] text-dark tracking-tight mb-2">
                  Tạo tài khoản mới
                </h2>
                <p className="text-gray font-medium">
                  Tham gia Mentoree ngay hôm nay.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="register-fullName" className="text-[12.8px] font-semibold text-gray tracking-[1px] ml-1">
                    Họ và tên
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray group-focus-within:text-primary transition-colors" size={18} aria-hidden />
                    <input
                      id="register-fullName"
                      type="text"
                      name="fullName"
                      placeholder="Nguyễn Văn A"
                      required
                      autoComplete="name"
                      className={inputFocusClass}
                    />
                  </div>
                  {fieldErrors.firstName && (
                    <p className="text-sm font-medium text-red-600 ml-1">{fieldErrors.firstName}</p>
                  )}
                  {fieldErrors.lastName && (
                    <p className="text-sm font-medium text-red-600 ml-1">{fieldErrors.lastName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-email" className="text-[12.8px] font-semibold text-gray tracking-[1px] ml-1">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray group-focus-within:text-primary transition-colors" size={18} aria-hidden />
                    <input
                      id="register-email"
                      type="email"
                      name="email"
                      placeholder="name@university.edu.vn"
                      required
                      autoComplete="email"
                      className={inputFocusClass}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-sm font-medium text-red-600 ml-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-password" className="text-[12.8px] font-semibold text-gray tracking-[1px] ml-1">
                    Mật khẩu
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray group-focus-within:text-primary transition-colors" size={18} aria-hidden />
                    <input
                      id="register-password"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                      className={inputFocusClass}
                    />
                  </div>
                  {fieldErrors.password && (
                    <p className="text-sm font-medium text-red-600 ml-1">{fieldErrors.password}</p>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-50 rounded-[8px] border border-red-100 flex items-center gap-3 text-red-600 text-sm font-bold">
                    <AlertCircle size={18} aria-hidden /> {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Đăng ký ngay
                      <ArrowRight size={20} aria-hidden />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-7 text-center text-gray font-medium">
                Đã có tài khoản?
                <Link
                  href="/login"
                  className="ml-2 text-primary font-semibold hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </MarketingHeroSection>
  );
}
