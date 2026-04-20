'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarPlus,
  FileText,
  ImageIcon,
  Paperclip,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Search,
  Send,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatAttachment, Conversation } from '@/features/dashboard/chat/types';
import { initials } from '@/features/dashboard/chat/utils';

export type DashboardChatPageViewProps = {
  active: Conversation | undefined;
  filtered: Conversation[];
  activeId: string;
  draft: string;
  setDraft: (v: string) => void;
  query: string;
  setQuery: (v: string) => void;
  mobileThread: boolean;
  setMobileThread: (v: boolean) => void;
  rightPanelOpen: boolean;
  setRightPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  sharedImages: ChatAttachment[];
  sharedFiles: ChatAttachment[];
  openThread: (id: string) => void;
  createConversation: () => void;
  send: () => void;
};

export function DashboardChatPageView({
  active,
  filtered,
  activeId,
  draft,
  setDraft,
  query,
  setQuery,
  mobileThread,
  setMobileThread,
  rightPanelOpen,
  setRightPanelOpen,
  bottomRef,
  sharedImages,
  sharedFiles,
  openThread,
  createConversation,
  send,
}: DashboardChatPageViewProps) {
  return (
    <div
      className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-slate-50 [--color-primary:#1e293b] [--color-primary-hover:#0f172a] [--color-badge-primary-bg:rgba(30,41,59,0.14)]"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <aside
          className={cn(
            'flex min-h-0 w-full flex-1 flex-col overflow-hidden border-slate-200 bg-white lg:h-full lg:w-[min(100%,300px)] lg:flex-none lg:shrink-0 lg:border-r',
            mobileThread && 'max-lg:hidden',
          )}
        >
          <div className="border-b border-slate-200 p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900">Hội thoại</h2>
              <button
                type="button"
                onClick={createConversation}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 transition-colors hover:bg-slate-50"
              >
                <Plus className="size-3.5" strokeWidth={2} />
                Tạo mới
              </button>
            </div>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                strokeWidth={2}
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo tên hoặc tin…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
              />
            </div>
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto" role="listbox" aria-label="Danh sách hội thoại">
            {filtered.map((c) => {
              const selected = c.id === activeId;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => openThread(c.id)}
                    className={cn(
                      'flex w-full gap-3 border-b border-slate-100 px-3 py-3 text-left transition-colors hover:bg-slate-50',
                      selected && 'bg-slate-100/90',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                        c.id === '2' ? 'bg-slate-600' : 'bg-primary',
                      )}
                      aria-hidden
                    >
                      {initials(c.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="truncate font-semibold text-slate-900">{c.name}</span>
                        <span className="shrink-0 text-[11px] text-slate-400">{c.time}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-slate-500">{c.roleLabel}</span>
                      <span className="mt-1 flex items-center gap-2">
                        <span className="min-w-0 flex-1 truncate text-sm text-slate-600">{c.lastMessage}</span>
                        {c.unread != null && c.unread > 0 ? (
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                            {c.unread > 9 ? '9+' : c.unread}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section
          className={cn(
            'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-slate-200 bg-white lg:border-r',
            !mobileThread && 'max-lg:hidden',
          )}
          aria-label="Nội dung hội thoại"
        >
          {active ? (
            <>
              <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-3 py-2.5 sm:px-4">
                <button
                  type="button"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
                  aria-label="Quay lại danh sách"
                  onClick={() => setMobileThread(false)}
                >
                  <ArrowLeft className="size-5" strokeWidth={2} />
                </button>
                <span
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                    active.id === '2' ? 'bg-slate-600' : 'bg-primary',
                  )}
                  aria-hidden
                >
                  {initials(active.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{active.name}</p>
                  <p className="truncate text-xs text-slate-500">{active.roleLabel}</p>
                </div>
                <Link
                  href="/dashboard/sessions"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-2.5 py-2 text-xs font-semibold text-white transition-colors hover:opacity-95 sm:px-3 sm:text-sm"
                  title="Lên lịch hẹn"
                >
                  <CalendarPlus className="size-4 shrink-0" strokeWidth={2} />
                  <span className="hidden sm:inline">Lên lịch hẹn</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setRightPanelOpen((o) => !o)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
                  aria-expanded={rightPanelOpen}
                  aria-label="Ảnh và tệp đã gửi"
                >
                  {rightPanelOpen ? <PanelRightClose className="size-5" /> : <PanelRightOpen className="size-5" />}
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/90 p-3 sm:p-4">
                {active.messages.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center text-sm text-slate-500">
                    <p>Chưa có tin nhắn. Nhập bên dưới để gửi.</p>
                  </div>
                ) : (
                  active.messages.map((m) => (
                    <div key={m.id}>
                      <div className={cn('flex', m.role === 'me' ? 'justify-end' : 'justify-start')}>
                        <div
                          className={cn(
                            'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[70%]',
                            m.role === 'me'
                              ? 'rounded-br-md bg-primary text-white'
                              : 'rounded-bl-md border border-slate-200 bg-white text-slate-800',
                          )}
                        >
                          <p className="whitespace-pre-wrap">{m.text}</p>
                          {m.attachments && m.attachments.length > 0 ? (
                            <ul className="mt-2 space-y-2">
                              {m.attachments.map((a) =>
                                a.kind === 'image' && a.url ? (
                                  <li key={a.id} className="overflow-hidden rounded-lg">
                                    <Image
                                      src={a.url}
                                      alt={a.name}
                                      width={280}
                                      height={180}
                                      className="h-auto max-h-48 w-full object-cover"
                                      unoptimized
                                    />
                                  </li>
                                ) : (
                                  <li
                                    key={a.id}
                                    className={cn(
                                      'flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs',
                                      m.role === 'me'
                                        ? 'border-white/30 bg-white/10 text-white'
                                        : 'border-slate-200 bg-slate-50 text-slate-700',
                                    )}
                                  >
                                    <FileText className="size-3.5 shrink-0" />
                                    <span className="truncate">{a.name}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          ) : null}
                          <p
                            className={cn(
                              'mt-1 text-right text-[10px]',
                              m.role === 'me' ? 'text-white/80' : 'text-slate-400',
                            )}
                          >
                            {m.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={bottomRef} />
              </div>

              <footer className="shrink-0 border-t border-slate-200 bg-white p-3 sm:p-4">
                <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-primary focus-within:bg-white">
                  <button
                    type="button"
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-200/80 hover:text-slate-800"
                    aria-label="Đính kèm"
                  >
                    <Paperclip className="size-[18px]" strokeWidth={2} />
                  </button>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    rows={1}
                    placeholder="Nhập tin nhắn…"
                    className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={send}
                    disabled={!draft.trim()}
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Gửi"
                  >
                    <Send className="size-[18px]" strokeWidth={2} />
                  </button>
                </div>
                <p className="mt-2 text-center text-[11px] text-slate-400">Enter gửi · Shift+Enter xuống dòng</p>
              </footer>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-slate-500">
              <p className="text-sm font-medium">Chưa có hội thoại</p>
            </div>
          )}
        </section>

        <aside
          className={cn(
            'flex min-h-0 w-full flex-col overflow-hidden border-slate-200 bg-white lg:h-full lg:w-72 lg:max-w-[320px] xl:w-80',
            'max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:z-[45] max-lg:w-[min(100vw-3rem,20rem)] max-lg:border-l max-lg:shadow-2xl',
            !rightPanelOpen && 'max-lg:hidden',
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-3 py-3 lg:py-2.5">
            <p className="text-sm font-semibold text-slate-900">Ảnh & tệp</p>
            <button
              type="button"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Đóng"
              onClick={() => setRightPanelOpen(false)}
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Ảnh</p>
            {sharedImages.length === 0 ? (
              <p className="mb-6 text-sm text-slate-400">Chưa có ảnh trong hội thoại này.</p>
            ) : (
              <ul className="mb-6 grid grid-cols-2 gap-2">
                {sharedImages.map((img) => (
                  <li key={img.id} className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                    {img.url ? (
                      <Image
                        src={img.url}
                        alt={img.name}
                        width={160}
                        height={120}
                        className="aspect-[4/3] h-auto w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center">
                        <ImageIcon className="size-8 text-slate-300" />
                      </div>
                    )}
                    <p className="truncate px-1.5 py-1 text-[10px] text-slate-500">{img.name}</p>
                  </li>
                ))}
              </ul>
            )}

            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Tệp</p>
            {sharedFiles.length === 0 ? (
              <p className="text-sm text-slate-400">Chưa có tệp đính kèm.</p>
            ) : (
              <ul className="space-y-2">
                {sharedFiles.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  >
                    <FileText className="size-4 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1 truncate">{f.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {rightPanelOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-[40] bg-slate-900/40 lg:hidden"
            aria-label="Đóng bảng phụ"
            onClick={() => setRightPanelOpen(false)}
          />
        ) : null}
      </div>
    </div>
  );
}
