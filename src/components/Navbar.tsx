'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

type NavItem = { name: string; path: string; isHash: boolean };

export const Navbar = () => {
  const { user, isAuthenticated, userRole, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavItem[] = [
    { name: 'Tìm Mentor', path: '/mentors', isHash: false },
    { name: 'Trở thành Mentor', path: '/register', isHash: false },
    ...(isAuthenticated && userRole !== 'mentor' && userRole !== 'admin'
      ? [{ name: 'Nộp báo cáo', path: '/my-reports', isHash: false as const }]
      : []),
    { name: 'Cách hoạt động', path: '#how-it-works', isHash: true },
    { name: 'Hỏi đáp', path: '#faq', isHash: true },
  ];

  const handleHashNav = (hash: string) => {
    setIsMobileMenuOpen(false);
    if (pathname !== '/') {
      router.push('/');
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isRouteActive = (path: string) => pathname === path;

  return (
    <nav
      className={cn(
        'sticky top-0 z-[100] w-full transition-all duration-300',
        isScrolled ? 'bg-white py-2.5 border-b border-border shadow-glass' : 'bg-transparent py-4'
      )}
      aria-label="Điều hướng chính"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-xl font-black tracking-tight text-primary">men</span>
          <span className="text-xl font-black tracking-tight text-dark group-hover:text-primary transition-colors">
            toree
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-orange mt-2.5 -ml-0.5" aria-hidden />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) =>
            link.isHash ? (
              <button
                key={link.name}
                type="button"
                onClick={() => handleHashNav(link.path)}
                className="text-[12px]  tracking-[1.5px] font-medium transition-colors hover:text-primary text-gray"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                href={link.path}
                className={cn(
                  'text-[12px] tracking-[1.5px] font-medium transition-colors hover:text-primary',
                  isRouteActive(link.path) ? 'text-primary' : 'text-gray'
                )}
              >
                {link.name}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-[15px] uppercase tracking-[1.5px] font-medium text-dark hover:text-primary transition-colors px-2"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="btn-primary py-2 px-5 text-sm"
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {userRole === 'mentor' && (
                <Link
                  href="/mentor"
                  className="text-[12.8px] uppercase tracking-[1px] font-semibold text-primary hover:bg-badge-primary-bg px-3 py-1.5 rounded-[4px] transition-colors hidden md:block"
                >
                  Kênh Mentor
                </Link>
              )}
              {userRole === 'admin' && (
                <Link
                  href="/admin"
                  className="text-[12.8px] uppercase tracking-[1px] font-semibold text-primary hover:bg-badge-primary-bg px-3 py-1.5 rounded-[4px] transition-colors hidden md:block"
                >
                  Trang Quản trị
                </Link>
              )}
              <Link
                href={
                  userRole === 'admin'
                    ? '/admin'
                    : userRole === 'mentor'
                      ? '/mentor'
                      : `/profile/${user?.id}`
                }
                className="flex items-center gap-2 group p-1.5 pr-4 rounded-[8px] border border-border hover:border-border-hover transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-teal-light flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4" aria-hidden />
                  )}
                </div>
                <div className="hidden xl:block text-left relative top-0.5">
                  <p className="text-sm font-semibold text-dark leading-none truncate max-w-[100px]">
                    {user?.fullName || 'User'}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="w-10 h-10 flex items-center justify-center text-gray hover:text-red-500 hover:bg-red-50 rounded-[4px] transition-all"
                aria-label="Đăng xuất"
              >
                <LogOut size={18} aria-hidden />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            className="lg:hidden p-2 rounded-[4px] hover:bg-surface-muted min-w-10 min-h-10 flex items-center justify-center"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden /> : <Menu className="w-6 h-6" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-border overflow-hidden shadow-glass"
            role="dialog"
            aria-modal="true"
            aria-label="Menu điều hướng"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) =>
                link.isHash ? (
                  <button
                    key={link.name}
                    type="button"
                    onClick={() => handleHashNav(link.path)}
                    className="block w-full text-left text-base font-semibold text-dark hover:text-primary py-2"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'block w-full text-left text-base font-semibold py-2 hover:text-primary',
                      isRouteActive(link.path) ? 'text-primary' : 'text-dark'
                    )}
                  >
                    {link.name}
                  </Link>
                )
              )}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      href={
                        userRole === 'admin'
                          ? '/admin'
                          : userRole === 'mentor'
                            ? '/mentor'
                            : `/profile/${user?.id}`
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-base font-semibold text-dark p-2 hover:bg-surface-muted rounded-[8px]"
                    >
                      <User className="w-6 h-6 text-primary" aria-hidden />
                      {userRole === 'mentor'
                        ? 'Kênh Mentor'
                        : userRole === 'admin'
                          ? 'Trang Quản trị'
                          : 'Hồ sơ cá nhân'}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-base font-semibold text-secondary-red p-2 hover:bg-red-50 rounded-[8px] w-full text-left mt-2"
                    >
                      <LogOut className="w-6 h-6" aria-hidden />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center text-base font-semibold text-dark py-2.5 border border-border rounded-[8px] hover:bg-surface-muted mb-3"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-primary block w-full text-center py-2.5"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
