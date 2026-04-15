import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-stripe-dark mb-4">Sản phẩm</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/">Tính năng</Link></li>
            <li><Link href="/">Tích hợp</Link></li>
            <li><Link href="/">Giá cả</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-stripe-dark mb-4">Công ty</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/">Giới thiệu</Link></li>
            <li><Link href="/">Tuyển dụng</Link></li>
            <li><Link href="/">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-stripe-dark mb-4">Tài nguyên</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/">Tài liệu</Link></li>
            <li><Link href="/">Trung tâm trợ giúp</Link></li>
            <li><Link href="/">Cộng đồng</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-stripe-dark mb-4">Pháp lý</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/">Quyền riêng tư</Link></li>
            <li><Link href="/">Điều khoản</Link></li>
            <li><Link href="/">Chính sách Cookie</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-50 flex justify-between items-center">
        <p className="text-xs text-gray-400">© 2026 UniShare Inc. Bảo lưu mọi quyền.</p>
        <div className="flex gap-4">
          <div className="w-5 h-5 bg-gray-200 rounded-full" />
          <div className="w-5 h-5 bg-gray-200 rounded-full" />
          <div className="w-5 h-5 bg-gray-200 rounded-full" />
        </div>
      </div>
    </footer>
  );
};
