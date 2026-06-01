import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ChatMessage, Conversation } from '@/features/dashboard/chat/types';
import { collectAttachments } from '@/features/dashboard/chat/utils';
import { chatService, type ChatContextType, type ChatConversationDto, type ChatMessageDto } from '@/services/chatService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useChatSocket } from '@/hooks/useChatSocket';

export function useDashboardChatPage() {
  const { user } = useAuth();
  const toast = useToast();
  const searchParams = useSearchParams();
  const conversationFromUrl = searchParams.get('conversation')?.trim() ?? '';
  const peerNameFromUrl = searchParams.get('peerName')?.trim() ?? '';
  const contextTypeFromUrl = (searchParams.get('contextType')?.trim() ?? '') as ChatContextType | '';
  const contextIdFromUrl = searchParams.get('contextId')?.trim() ?? '';
  const messageContext =
    contextTypeFromUrl && contextIdFromUrl
      ? { contextType: contextTypeFromUrl as ChatContextType, contextId: contextIdFromUrl }
      : undefined;
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

  const conversationTitle = useCallback(
    (c: ChatConversationDto) => {
      const shortId = c.id.slice(0, 8);
      if (c.type === 'general') {
        if (peerNameFromUrl && c.id === conversationFromUrl) {
          return peerNameFromUrl;
        }
        return 'Tin nhắn';
      }
      if (c.type === 'booking' && c.bookingId) {
        return `Booking #${String(c.bookingId).slice(0, 8)}`;
      }
      if (c.type === 'support') {
        return `Hỗ trợ #${shortId}`;
      }
      return `Hội thoại #${shortId}`;
    },
    [conversationFromUrl, peerNameFromUrl],
  );

  const conversationRole = useCallback((c: ChatConversationDto) => {
    if (c.type === 'general') return 'Tin nhắn';
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

  const [convPage, setConvPage] = useState(0);
  const [convSize, setConvSize] = useState(20);
  const [convTotal, setConvTotal] = useState(0);
  const [convTotalPages, setConvTotalPages] = useState(0);

  const toUiConversation = useCallback(
    (c: ChatConversationDto): Conversation => ({
      id: c.id,
      name: conversationTitle(c),
      roleLabel: conversationRole(c),
      lastMessage: 'Chưa có tin nhắn',
      time: formatTime(c.createdAt),
      unread: undefined,
      messages: [],
    }),
    [conversationRole, conversationTitle, formatTime],
  );

  useEffect(() => {
    let activeRequest = true;
    const loadConversations = async () => {
      setLoading(true);
      try {
        const page = await chatService.listConversations(convPage, convSize);
        const items = page.items;
        if (!activeRequest) return;
        setConvTotal(page.total);
        setConvTotalPages(page.totalPages);
        const mapped: Conversation[] = items.map(toUiConversation);
        setConversations(mapped);
        if (mapped.length > 0) {
          setActiveId((prev) => {
            if (conversationFromUrl && mapped.some((c) => c.id === conversationFromUrl)) {
              return conversationFromUrl;
            }
            return prev || mapped[0].id;
          });
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
  }, [convPage, convSize, conversationFromUrl, peerNameFromUrl, toast, toUiConversation]);

  const fetchedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!conversationFromUrl) return;

    setActiveId(conversationFromUrl);
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
      setMobileThread(true);
    }

    if (conversations.some((c) => c.id === conversationFromUrl)) {
      return;
    }
    if (fetchedUrlRef.current === conversationFromUrl || loading) {
      return;
    }

    fetchedUrlRef.current = conversationFromUrl;
    let cancelled = false;

    const loadRemote = async () => {
      try {
        const remote = await chatService.getConversation(conversationFromUrl);
        if (cancelled || !remote?.id) return;
        const mapped = toUiConversation(remote);
        setConversations((prev) => {
          if (prev.some((c) => c.id === mapped.id)) return prev;
          return [mapped, ...prev];
        });
      } catch (error) {
        fetchedUrlRef.current = null;
        toast.error(error instanceof Error ? error.message : 'Không mở được hội thoại từ liên kết.');
      }
    };

    void loadRemote();
    return () => {
      cancelled = true;
    };
  }, [conversationFromUrl, conversations, loading, peerNameFromUrl, toast, toUiConversation]);

  useEffect(() => {
    if (!activeId || loadedMessagesRef.current.has(activeId)) {
      return;
    }
    let cancelled = false;
    const loadMessages = async () => {
      try {
        const page = await chatService.listMessages(activeId, 0, 50);
        if (cancelled) return;
        const uiMessages = [...page.items].reverse().map(toUiMessage);
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
      const saved = await chatService.sendMessage(active.id, {
        content: text,
        type: 'text',
        contextType: messageContext?.contextType,
        contextId: messageContext?.contextId,
      });
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
    convPage,
    setConvPage,
    convSize,
    setConvSize,
    convTotal,
    convTotalPages,
  };
}
