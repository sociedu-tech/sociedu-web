import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
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
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = (e.target as any).elements[0].value;
    const password = (e.target as any).elements[1].value;

    try {
      await authService.login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
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
            <Link to="/" className="flex items-center gap-3 mb-12 group">
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
              Chào mừng trở lại!
            </h2>
            <p className="text-airbnb-gray font-medium">
              Vui lòng đăng nhập để tiếp tục.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-airbnb-gray uppercase tracking-widest ml-1">Email sinh viên</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-gray group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="name@university.edu.vn"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-airbnb-gray uppercase tracking-widest">Mật khẩu</label>
                <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Quên mật khẩu?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-gray group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-medium transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-airbnb-dark text-white rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Đăng nhập
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
            Chưa có tài khoản?
            <Link
              to="/register"
              className="ml-2 text-blue-600 font-black hover:underline"
            >
              Đăng ký miễn phí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
