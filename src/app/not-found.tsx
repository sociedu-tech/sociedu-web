import Link from 'next/link';
import { FileQuestion, ArrowLeft, LayoutDashboard } from 'lucide-react';

// Trong Next.js 13+ App Router, not-found.tsx mặc định là Server Component
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center selection:bg-indigo-100 selection:text-indigo-900">
      <div className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-white text-indigo-600 shadow-md ring-1 ring-slate-900/5 transition-transform hover:scale-105">
        <FileQuestion size={40} strokeWidth={2} />
      </div>
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
        404
      </h1>
      <h2 className="mt-4 text-xl font-semibold text-slate-800 sm:text-2xl">
        Không tìm thấy nội dung
      </h2>
      <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-500 sm:max-w-md">
        Đường dẫn bạn vừa truy cập không tồn tại, bạn gõ sai địa chỉ hoặc nội dung này đã bị gỡ bỏ/chuyển đi nơi khác.
      </p>
      
      <div className="mt-10 flex flex-col items-center gap-3 w-full sm:flex-row sm:w-auto">
        <Link
          href="/"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow focus:outline-none active:scale-[0.98]"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span>Về trang chủ</span>
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-[15px] font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none active:scale-[0.98]"
        >
          <LayoutDashboard size={18} strokeWidth={2.5} className="text-slate-400" />
          <span>Bảng điều khiển</span>
        </Link>
      </div>
    </div>
  );
}
