import React from 'react';

export default function AdminMentorDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { mentorId: string };
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* TODO: Gắn một Sub-Navigation Tabs ở đây (Tổng quan | Gói dịch vụ | Học viên | Lịch sử) */}
      <nav className="flex gap-4 border-b border-slate-200 pb-2">
        <span className="font-semibold text-primary">ID: {params.mentorId}</span>
        {/* Các Link tab */}
      </nav>

      {/* Nội dung trang con (page.tsx, packages/page.tsx, ...) */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
