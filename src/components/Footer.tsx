import React from 'react';
import Link from 'next/link';
import { Facebook, Linkedin, Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-border py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        <div>
          <h4 className="text-sm font-semibold text-dark mb-3">Sản phẩm</h4>
          <ul className="space-y-1.5 text-xs text-gray-300">
            <li>
              <Link href="/#how-it-works" className="hover:text-primary transition-colors">
                Tính năng
              </Link>
            </li>
            <li>
              <Link href="/mentors" className="hover:text-primary transition-colors">
                Tìm mentor
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-primary transition-colors">
                Trở thành mentor
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-dark mb-3">Công ty</h4>
          <ul className="space-y-1.5 text-xs text-gray-300">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <span className="text-gray-400">Tuyển dụng — sắp ra mắt</span>
            </li>
            <li>
              <span className="text-gray-400">Blog — sắp ra mắt</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-dark mb-3">Tài nguyên</h4>
          <ul className="space-y-1.5 text-xs text-gray-300">
            <li>
              <Link href="/documents" className="hover:text-primary transition-colors">
                Tài liệu
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-primary transition-colors">
                Câu hỏi thường gặp
              </Link>
            </li>
            <li>
              <Link href="/mentors" className="hover:text-primary transition-colors">
                Danh sách mentor
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-dark mb-3">Pháp lý</h4>
          <ul className="space-y-1.5 text-xs text-gray-300">
            <li>
              <span className="text-gray-400">Quyền riêng tư — sắp ra mắt</span>
            </li>
            <li>
              <span className="text-gray-400">Điều khoản — sắp ra mắt</span>
            </li>
            <li>
              <span className="text-gray-400">Cookie — sắp ra mắt</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-[11px] text-gray-300 text-center sm:text-left leading-relaxed">
          © {new Date().getFullYear()} UniShare Inc. · <span className="font-medium text-gray">Mentoree</span>. Bảo lưu mọi quyền.
        </p>
        <div className="flex gap-3">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-primary transition-colors p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Facebook"
          >
            <Facebook size={20} strokeWidth={1.75} />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-primary transition-colors p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} strokeWidth={1.75} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-primary transition-colors p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="GitHub"
          >
            <Github size={20} strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </footer>
  );
};
