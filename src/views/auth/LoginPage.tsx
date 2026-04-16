'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { isApiClientError } from '@/lib/api';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  Github,
  Chrome,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUnverifiedEmail(null);
    setResendMessage(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login({ email, password });
      const params = new URLSearchParams(window.location.search);
      const from = params.get('from') || '/';
      router.push(from);
    } catch (err: unknown) {
      if (isApiClientError(err) && err.errorType === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(email);
      }
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setResendLoading(true);
    setError(null);
    setResendMessage(null);
    try {
      const message = await authService.resendVerification(unverifiedEmail);
      setResendMessage(message || 'Đã gửi lại email xác minh. Vui lòng kiểm tra hộp thư.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể gửi lại email xác minh.');
    } finally {
      setResendLoading(false);
    }
  };

  const inputFocusClass =
    'w-full pl-12 pr-4 py-4 bg-white border border-border rounded-[4px] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-all';

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[8px] shadow-glass overflow-hidden border border-border">

        <div className="hidden lg:flex flex-col justify-between p-12 bg-dark text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-400/40 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3 mb-12 group">
              <div className="w-12 h-12 bg-white rounded-[8px] flex items-center justify-center text-dark shadow-glass group-hover:translate-x-1 transition-transform">
                <GraduationCap className="w-7 h-7 text-primary" />
              </div>
              <span className="text-3xl font-semibold tracking-tighter">Mentoree</span>
            </Link>

            <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight mb-6">
              Đồng hành cùng <br />
              <span className="text-primary">chuyên gia của bạn.</span>
            </h1>
            <p className="text-gray-300 text-lg font-medium max-w-md">
              Kết nối với mentor đã trải nghiệm thực tế, đặt lịch tư vấn và xây lộ trình phù hợp mục tiêu nghề nghiệp của bạn.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <CheckCircle2 className="text-primary w-5 h-5" />
              </div>
              <p className="font-bold">Mentor được duyệt, hồ sơ minh bạch</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <CheckCircle2 className="text-primary w-5 h-5" />
              </div>
              <p className="font-bold">Đặt lịch & thanh toán trên một nền tảng</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <CheckCircle2 className="text-primary w-5 h-5" />
              </div>
              <p className="font-bold">Theo dõi buổi tư vấn và báo cáo tiến độ</p>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-4xl md:text-[56px] font-semibold leading-[1.04] text-dark tracking-tight mb-2">
              Chào mừng trở lại!
            </h2>
            <p className="text-gray font-medium">
              Vui lòng đăng nhập để tiếp tục.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-[12.8px] font-semibold text-gray uppercase tracking-[1px] ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-gray group-focus-within:text-primary transition-colors" size={20} aria-hidden />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="name@university.edu.vn"
                  required
                  autoComplete="email"
                  className={inputFocusClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="login-password" className="text-[12.8px] font-semibold text-gray uppercase tracking-[1px]">
                  Mật khẩu
                </label>
                <button type="button" className="text-xs font-bold text-primary hover:underline">
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray group-focus-within:text-primary transition-colors" size={20} aria-hidden />
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className={inputFocusClass}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-[8px] border border-red-100 text-red-600 text-sm">
                <div className="flex items-center gap-3 font-bold">
                  <AlertCircle size={18} aria-hidden /> {error}
                </div>
                {unverifiedEmail && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="mt-3 px-3 py-2 rounded-lg border border-red-200 text-red-700 font-semibold hover:bg-red-100 disabled:opacity-60"
                  >
                    {resendLoading ? 'Đang gửi lại email xác minh...' : 'Gửi lại email xác minh'}
                  </button>
                )}
                {resendMessage && <p className="mt-2 font-medium text-green-700">{resendMessage}</p>}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight size={20} aria-hidden />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray font-medium tracking-[1.5px]">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              type="button"
              disabled
              title="Đang phát triển"
              aria-label="Đăng nhập Google — sắp ra mắt"
              className="flex items-center justify-center gap-3 py-3 border-2 border-border rounded-[8px] font-medium text-dark opacity-50 cursor-not-allowed"
            >
              <Chrome size={20} className="text-red-500" aria-hidden /> Google
            </button>
            <button
              type="button"
              disabled
              title="Đang phát triển"
              aria-label="Đăng nhập GitHub — sắp ra mắt"
              className="flex items-center justify-center gap-3 py-3 border-2 border-border rounded-[8px] font-medium text-dark opacity-50 cursor-not-allowed"
            >
              <Github size={20} aria-hidden /> GitHub
            </button>
          </div>

          <p className="mt-10 text-center text-gray font-medium">
            Chưa có tài khoản?
            <Link
              href="/register"
              className="ml-2 text-primary font-semibold hover:underline"
            >
              Đăng ký miễn phí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
