'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

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

  const navLinks = [
    { name: 'Tìm Mentor', path: '/mentors' },
    { name: 'Trở thành Mentor', path: '/register' },
    ...(isAuthenticated && userRole !== 'mentor' && userRole !== 'admin' ? [{ name: 'Nộp báo cáo', path: '/my-reports' }] : []),
    { name: 'Cách hoạt động', path: '#how-it-works' },
    { name: 'Hỏi đáp', path: '#faq' },
  ];

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    if (path.startsWith('#')) {
      if (pathname !== '/') {
        router.push('/');
        setTimeout(() => {
          const element = document.querySelector(path);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        const element = document.querySelector(path);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(path);
    }
  };

  return (
    <nav className={cn(
      "sticky top-0 z-[100] w-full transition-all duration-300",
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-2xl font-black tracking-tight text-primary">men</span>
          <span className="text-2xl font-black tracking-tight text-dark group-hover:text-primary transition-colors">toree</span>
          <div className="w-2 h-2 rounded-full bg-orange-400 mt-3 -ml-0.5"></div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.path)}
              className={cn(
                "text-[15px] font-bold transition-colors hover:text-primary",
                (pathname === link.path && !link.path.startsWith('#')) ? "text-primary" : "text-gray"
              )}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-[15px] font-bold text-dark hover:text-primary transition-colors px-2">
                Đăng nhập
              </Link>
              <Link href="/register" className="btn-primary py-2 px-6 text-sm hover:scale-105 active:scale-95 shadow-none hover:shadow-lg">
                Đăng ký
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {userRole === 'mentor' && (
                <Link href="/mentor" className="text-sm font-bold text-primary hover:bg-primary/5 px-4 py-2 rounded-full transition-colors hidden md:block">
                  Kênh Mentor
                </Link>
              )}
              {userRole === 'admin' && (
                <Link href="/admin" className="text-sm font-bold text-primary hover:bg-primary/5 px-4 py-2 rounded-full transition-colors hidden md:block">
                  Trang Quản trị
                </Link>
              )}
              <Link
                href={
                  userRole === 'admin' ? "/admin" :
                    userRole === 'mentor' ? "/mentor" :
                      `/profile/${user?.id}`
                }
                className="flex items-center gap-2 group p-1.5 pr-4 rounded-full border border-gray-200 hover:border-primary transition-colors hover:bg-teal-light/30"
              >
                <div className="w-8 h-8 rounded-full bg-teal-light flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="hidden xl:block text-left relative top-0.5">
                  <p className="text-sm font-bold text-dark leading-none truncate max-w-[100px]">{user?.fullName || 'User'}</p>
                </div>
              </Link>
              <button
                onClick={logout}
                className="w-10 h-10 flex items-center justify-center text-gray hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Đăng xuất"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 min-w-10"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 overflow-hidden shadow-xl"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className="block w-full text-left text-lg font-bold text-dark hover:text-primary py-2"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link 
                      href={
                        userRole === 'admin' ? "/admin" :
                          userRole === 'mentor' ? "/mentor" :
                            `/profile/${user?.id}`
                      } 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center gap-3 text-lg font-bold text-dark p-2 hover:bg-gray-50 rounded-lg"
                    >
                      <User className="w-6 h-6 text-primary" /> {userRole === 'mentor' ? 'Kênh Mentor' : userRole === 'admin' ? 'Trang Quản trị' : 'Hồ sơ cá nhân'}
                    </Link>
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 text-lg font-bold text-red-500 p-2 hover:bg-red-50 rounded-lg w-full text-left mt-2">
                       <LogOut className="w-6 h-6" /> Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center text-lg font-bold text-dark py-3 border border-gray-200 rounded-xl hover:bg-gray-50 mb-3">
                      Đăng nhập
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary block w-full text-center text-lg py-3 rounded-xl">
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
