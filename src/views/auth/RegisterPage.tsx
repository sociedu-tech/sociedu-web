'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { isApiClientError } from '@/lib/api';
import {
  ShoppingBag,
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
      <div className="min-h-screen flex items-center justify-center bg-[#F3F2EF]">
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

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">

        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-airbnb-dark text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-500 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3 mb-12 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-airbnb-dark shadow-lg group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <span className="text-3xl font-black tracking-tighter">VibeCart</span>
            </Link>

            <h1 className="text-5xl font-black leading-[1.1] tracking-tight mb-6">
              Nâng tầm kiến thức <br />
              <span className="text-blue-400">Kết nối chuyên gia.</span>
            </h1>
            <p className="text-gray-400 text-lg font-medium max-w-md">
              Sàn thương mại điện tử dành riêng cho sinh viên. Mua bán tài liệu, source code và kết nối với các Mentor hàng đầu.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <CheckCircle2 className="text-blue-400 w-5 h-5" />
              </div>
              <p className="font-bold">Hơn 10,000+ tài liệu chất lượng</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <CheckCircle2 className="text-blue-400 w-5 h-5" />
              </div>
              <p className="font-bold">Đội ngũ Mentor từ các trường Top</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <CheckCircle2 className="text-blue-400 w-5 h-5" />
              </div>
              <p className="font-bold">Giao dịch an toàn & nhanh chóng</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-airbnb-dark tracking-tight mb-2">
              Tạo tài khoản mới
            </h2>
            <p className="text-airbnb-gray font-medium">
              Tham gia cộng đồng VibeCart ngay hôm nay.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-airbnb-gray uppercase tracking-widest ml-1">Họ và tên</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-gray group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-medium transition-all"
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
              <label className="text-xs font-bold text-airbnb-gray uppercase tracking-widest ml-1">Email sinh viên</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-gray group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@university.edu.vn"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-medium transition-all"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-sm font-medium text-red-600 ml-1">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-airbnb-gray uppercase tracking-widest ml-1">Mật khẩu</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-gray group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-medium transition-all"
                />
              </div>
              {fieldErrors.password && (
                <p className="text-sm font-medium text-red-600 ml-1">{fieldErrors.password}</p>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-green-700 text-sm">
                <div className="flex items-center gap-3 font-bold">
                  <CheckCircle2 size={18} /> Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.
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

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-4 bg-airbnb-dark text-white rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Đăng ký ngay
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-airbnb-gray font-bold tracking-widest">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 border-2 border-gray-100 rounded-2xl font-bold text-airbnb-dark hover:bg-gray-50 transition-all">
              <Chrome size={20} className="text-red-500" /> Google
            </button>
            <button className="flex items-center justify-center gap-3 py-3 border-2 border-gray-100 rounded-2xl font-bold text-airbnb-dark hover:bg-gray-50 transition-all">
              <Github size={20} /> GitHub
            </button>
          </div>

          <p className="mt-10 text-center text-airbnb-gray font-medium">
            Đã có tài khoản?
            <Link
              href="/login"
              className="ml-2 text-blue-600 font-black hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
