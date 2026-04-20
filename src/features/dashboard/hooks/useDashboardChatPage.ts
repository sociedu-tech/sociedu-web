import { useEffect, useMemo, useRef, useState } from 'react';
import { MOCK_CONVERSATIONS } from '@/data/dashboardChatMock';
import type { ChatMessage, Conversation } from '@/features/dashboard/chat/types';
import { collectAttachments } from '@/features/dashboard/chat/utils';

export function useDashboardChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState(MOCK_CONVERSATIONS[0]?.id ?? '');
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [mobileThread, setMobileThread] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];
  const filtered = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(query.trim().toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const { images: sharedImages, files: sharedFiles } = useMemo(
    () => (active ? collectAttachments(active.messages) : { images: [], files: [] }),
    [active],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, conversations]);

  const openThread = (id: string) => {
    setActiveId(id);
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
      setMobileThread(true);
    }
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: undefined } : c)));
  };

  const createConversation = () => {
    const id = `new-${Date.now()}`;
    setConversations((prev) => [
      {
        id,
        name: 'Hội thoại mới',
        roleLabel: 'Soạn tin để bắt đầu',
        lastMessage: 'Chưa có tin nhắn',
        time: 'Vừa xong',
        messages: [],
      },
      ...prev,
    ]);
    setActiveId(id);
    setMobileThread(true);
  };

  const send = () => {
    const text = draft.trim();
    if (!text || !active) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const msg: ChatMessage = {
      id: `local-${now.getTime()}`,
      role: 'me',
      text,
      time,
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [...c.messages, msg],
              lastMessage: text,
              time: 'Vừa xong',
            }
          : c,
      ),
    );
    setDraft('');
  };

  return {
    conversations,
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
  };
}
