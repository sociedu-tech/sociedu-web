'use client';

import { Search } from 'lucide-react';

type Props = {
  placeholder?: string;
};

export function MentorOrdersSearchBar({ placeholder = 'Tìm mã đơn, tên học viên…' }: Props) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        autoComplete="off"
      />
    </div>
  );
}
