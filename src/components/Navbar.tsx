import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X, LogOut, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, userRole, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Khám phá', path: '/' },
    { name: 'Tìm Mentor', path: '/mentors' },
  ];

  return (
    <nav className={cn(
      "sticky top-0 z-[100] w-full transition-all duration-300",
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-white py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-airbnb-red rounded-xl flex items-center justify-center text-white shadow-lg shadow-airbnb-red/20 group-hover:scale-110 transition-transform">
            <Code className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-airbnb-dark">UniShare</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={cn(
                "text-sm font-bold transition-colors hover:text-airbnb-red",
                location.pathname === link.path ? "text-airbnb-red" : "text-airbnb-gray"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          {!isAuthenticated ? (
            <Link to="/login" className="hidden md:block px-6 py-2 bg-airbnb-dark text-white rounded-full text-sm font-bold hover:bg-black transition-all shadow-md">
              Đăng nhập
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to={
                  userRole === 'admin' ? "/admin" : 
                  userRole === 'mentor' ? "/mentor-dashboard" :
                  `/profile/${user?.id}`
                } 
                className="flex items-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-airbnb-gray group-hover:bg-airbnb-red group-hover:text-white transition-all shadow-sm overflow-hidden">
                  <User className="w-5 h-5" />
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-[10px] font-bold text-airbnb-gray uppercase tracking-tighter leading-none mb-1">
                    {userRole === 'admin' ? 'Quản trị' : userRole === 'mentor' ? 'Mentor' : 'Tài khoản'}
                  </p>
                  <p className="text-sm font-bold text-airbnb-dark leading-none">{user?.fullName || 'User'}</p>
                </div>
              </Link>
              <button 
                onClick={logout}
                className="p-2 text-airbnb-gray hover:text-airbnb-red hover:bg-red-50 rounded-full transition-all"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100"
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
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-bold text-airbnb-dark hover:text-airbnb-red"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <Link to="/profile/1" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-airbnb-dark">
                  <User className="w-6 h-6" /> Hồ sơ cá nhân
                </Link>
                {!isAuthenticated && (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-bold text-blue-600">
                    <User className="w-6 h-6" /> Đăng nhập / Đăng ký
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
