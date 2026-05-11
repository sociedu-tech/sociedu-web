import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChatMessage, Conversation } from '@/features/dashboard/chat/types';
import { collectAttachments } from '@/features/dashboard/chat/utils';
import { chatService, type ChatConversationDto, type ChatMessageDto } from '@/services/chatService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useChatSocket } from '@/hooks/useChatSocket';

export function useDashboardChatPage() {
  const { user } = useAuth();
  const toast = useToast();
  const { connected, subscribeConversation } = useChatSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState('');
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [mobileThread, setMobileThread] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const loadedMessagesRef = useRef<Set<string>>(new Set());

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

  const formatTime = useCallback((raw?: string) => {
    if (!raw) {
      return 'Vừa xong';
    }
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) {
      return 'Vừa xong';
    }
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }, []);

  const conversationTitle = useCallback((c: ChatConversationDto) => {
    const shortId = c.id.slice(0, 8);
    if (c.type === 'booking' && c.bookingId) {
      return `Booking #${String(c.bookingId).slice(0, 8)}`;
    }
    if (c.type === 'support') {
      return `Hỗ trợ #${shortId}`;
    }
    return `Hội thoại #${shortId}`;
  }, []);

  const conversationRole = useCallback((c: ChatConversationDto) => {
    if (c.type === 'booking') return 'Chat theo booking';
    if (c.type === 'support') return 'CSKH';
    return 'Trò chuyện';
  }, []);

  const toUiMessage = useCallback(
    (m: ChatMessageDto): ChatMessage => ({
      id: m.id,
      role: String(m.senderId) === user?.id ? 'me' : 'them',
      text: m.content || '',
      time: formatTime(m.createdAt),
      attachments: (m.attachmentFileIds ?? []).map((fileId) => ({
        id: String(fileId),
        kind: 'file',
        name: `Tệp đính kèm ${String(fileId).slice(0, 8)}`,
      })),
    }),
    [formatTime, user?.id],
  );

  const upsertMessage = useCallback(
    (conversationId: string, uiMessage: ChatMessage) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          const exists = c.messages.some((m) => m.id === uiMessage.id);
          const nextMessages = exists
            ? c.messages.map((m) => (m.id === uiMessage.id ? uiMessage : m))
            : [...c.messages, uiMessage];
          return {
            ...c,
            messages: nextMessages,
            lastMessage: uiMessage.text || 'Đã gửi tệp đính kèm',
            time: uiMessage.time,
            unread: activeId === conversationId ? undefined : (c.unread ?? 0) + (exists ? 0 : 1),
          };
        }),
      );
    },
    [activeId],
  );

  useEffect(() => {
    let activeRequest = true;
    const loadConversations = async () => {
      setLoading(true);
      try {
        const items = await chatService.listConversations();
        if (!activeRequest) return;
        const mapped: Conversation[] = items.map((c) => ({
          id: c.id,
          name: conversationTitle(c),
          roleLabel: conversationRole(c),
          lastMessage: 'Chưa có tin nhắn',
          time: formatTime(c.createdAt),
          unread: undefined,
          messages: [],
        }));
        setConversations(mapped);
        if (mapped.length > 0) {
          setActiveId((prev) => prev || mapped[0].id);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Không tải được danh sách hội thoại.');
      } finally {
        if (activeRequest) {
          setLoading(false);
        }
      }
    };
    void loadConversations();
    return () => {
      activeRequest = false;
    };
  }, [conversationRole, conversationTitle, formatTime, toast]);

  useEffect(() => {
    if (!activeId || loadedMessagesRef.current.has(activeId)) {
      return;
    }
    let cancelled = false;
    const loadMessages = async () => {
      try {
        const msgs = await chatService.listMessages(activeId);
        if (cancelled) return;
        const uiMessages = msgs.map(toUiMessage);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  messages: uiMessages,
                  lastMessage: uiMessages[uiMessages.length - 1]?.text || c.lastMessage,
                  time: uiMessages[uiMessages.length - 1]?.time || c.time,
                  unread: undefined,
                }
              : c,
          ),
        );
        loadedMessagesRef.current.add(activeId);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Không tải được tin nhắn.');
      }
    };
    void loadMessages();
    return () => {
      cancelled = true;
    };
  }, [activeId, toUiMessage, toast]);

  useEffect(() => {
    if (!connected || conversations.length === 0) {
      return;
    }
    const unsubscribers = conversations.map((c) =>
      subscribeConversation(c.id, (message) => {
        const uiMessage = toUiMessage({
          id: message.id,
          senderId: message.senderId,
          content: message.content,
          type: message.type || 'text',
          edited: message.edited,
          createdAt: message.createdAt,
          attachmentFileIds: (message.attachmentFileIds as string[] | null | undefined) ?? [],
        });
        upsertMessage(c.id, uiMessage);
      }),
    );
    return () => {
      unsubscribers.forEach((fn) => fn());
    };
  }, [connected, conversations, subscribeConversation, toUiMessage, upsertMessage]);

  const openThread = (id: string) => {
    setActiveId(id);
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
      setMobileThread(true);
    }
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: undefined } : c)));
  };

  const createConversation = () => {
    toast.info('Tạo hội thoại mới sẽ được mở từ flow booking/support trên backend.');
  };

  const send = async () => {
    const text = draft.trim();
    if (!text || !active) return;
    try {
      const saved = await chatService.sendMessage(active.id, { content: text, type: 'text' });
      if (saved) {
        upsertMessage(active.id, toUiMessage(saved));
      }
      setDraft('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gửi tin nhắn thất bại.');
    }
  };

  return {
    conversations,
    loading,
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
