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
  User,
  ArrowRight,
  Github,
  Chrome,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { isAuthenticated } = useAuth();

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
    setFieldErrors({});
    setResendMessage(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const trimmedName = fullName.trim();
    const nameParts = trimmedName.split(/\s+/);
    const firstName = nameParts.pop() ?? '';
    const lastName = nameParts.join(' ') || firstName;

    try {
      await authService.register({
        email,
        password,
        firstName,
        lastName,
      });
      setSuccess(true);
      setRegisteredEmail(email);
    } catch (err: unknown) {
      if (isApiClientError(err) && err.errorType === 'VALIDATION_ERROR' && err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!registeredEmail) return;
    setResendLoading(true);
    setResendMessage(null);
    setError(null);
    try {
      const message = await authService.resendVerification(registeredEmail);
      setResendMessage(message || 'Email xác minh đã được gửi lại. Vui lòng kiểm tra hộp thư.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể gửi lại email xác minh.');
    } finally {
      setResendLoading(false);
    }
  };

  const inputFocusClass =
    'w-full pl-12 pr-4 py-3 bg-white border border-border rounded-[4px] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm transition-all';

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[8px] shadow-glass overflow-hidden border border-border">

        <div className="hidden lg:flex flex-col justify-between p-10 bg-dark text-white relative overflow-hidden">
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

            {success && (
              <div className="p-4 bg-green-50 rounded-[8px] border border-green-100 text-green-700 text-sm">
                <div className="flex items-center gap-3 font-bold">
                  <CheckCircle2 size={18} aria-hidden /> Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={resendLoading}
                    onClick={handleResendVerification}
                    className="px-4 py-2 rounded-lg border border-green-300 text-green-700 font-semibold hover:bg-green-100 disabled:opacity-60"
                  >
                    {resendLoading ? 'Đang gửi...' : 'Gửi lại email xác minh'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="px-4 py-2 rounded-lg border border-green-300 text-green-700 font-semibold hover:bg-green-100"
                  >
                    Đi tới đăng nhập
                  </button>
                </div>
                {resendMessage && <p className="mt-2 text-green-700 font-medium">{resendMessage}</p>}
              </div>
            )}

            <button type="submit" disabled={loading || success} className="w-full btn-primary disabled:opacity-50">
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
        </div>
      </div>
    </div>
  );
}
