import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { ChatMessage, Conversation } from '@/features/dashboard/chat/types';
import { avatarUrlForUser, collectAttachments, dedupeConversationsByPeer, sortConversationsByRecent } from '@/features/dashboard/chat/utils';
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
      if (c.peerDisplayName?.trim()) {
        return c.peerDisplayName.trim();
      }
      if (peerNameFromUrl && c.id === conversationFromUrl) {
        return peerNameFromUrl;
      }
      const shortId = c.id.slice(0, 8);
      if (c.type === 'support') {
        return `Hỗ trợ #${shortId}`;
      }
      return 'Tin nhắn';
    },
    [conversationFromUrl, peerNameFromUrl],
  );

  const conversationRole = useCallback((c: ChatConversationDto) => {
    if (c.type === 'support') return 'CSKH';
    if (c.peerUserId) return 'Tin nhắn';
    if (c.type === 'booking') return 'Mentoring';
    return 'Trò chuyện';
  }, []);

  const toUiMessage = useCallback(
    (m: ChatMessageDto, sendStatus?: ChatMessage['sendStatus']): ChatMessage => ({
      id: String(m.id || `${m.senderId}-${m.createdAt ?? ''}`),
      role: String(m.senderId) === user?.id ? 'me' : 'them',
      text: m.content || '',
      time: formatTime(m.createdAt),
      sendStatus: String(m.senderId) === user?.id ? sendStatus ?? 'sent' : undefined,
      context:
        m.contextType && m.contextId && m.contextType !== 'general'
          ? { contextType: m.contextType as ChatContextType, contextId: String(m.contextId) }
          : undefined,
      attachments: (m.attachmentFileIds ?? []).map((fileId) => ({
        id: String(fileId),
        kind: 'file',
        name: `Tệp đính kèm ${String(fileId).slice(0, 8)}`,
      })),
    }),
    [formatTime, user?.id],
  );

  const mergeMessages = useCallback(
    (messages: ChatMessage[], uiMessage: ChatMessage, pendingClientId?: string) => {
      if (pendingClientId) {
        const pendingIdx = messages.findIndex((m) => m.id === pendingClientId);
        if (pendingIdx >= 0) {
          const next = [...messages];
          next[pendingIdx] = uiMessage;
          return next;
        }
      }

      if (uiMessage.role === 'me') {
        const pendingIdx = messages.findIndex(
          (m) => m.sendStatus === 'sending' && m.text === uiMessage.text,
        );
        if (pendingIdx >= 0 && messages[pendingIdx].id !== uiMessage.id) {
          const next = [...messages];
          next[pendingIdx] = uiMessage;
          return next;
        }
      }

      const exists = messages.some((m) => m.id === uiMessage.id);
      if (exists) {
        return messages.map((m) => (m.id === uiMessage.id ? uiMessage : m));
      }
      return [...messages, uiMessage];
    },
    [],
  );

  const upsertMessage = useCallback(
    (conversationId: string, uiMessage: ChatMessage, options?: { pendingClientId?: string }) => {
      setConversations((prev) => {
        const next = prev.map((c) => {
          if (c.id !== conversationId) return c;
          if (!uiMessage.id) return c;
          const nextMessages = mergeMessages(c.messages, uiMessage, options?.pendingClientId);
          const nowIso = new Date().toISOString();
          const shouldBumpUnread =
            uiMessage.role !== 'me' && activeId !== conversationId && nextMessages.length > c.messages.length;
          return {
            ...c,
            messages: nextMessages,
            lastMessage: uiMessage.text || 'Đã gửi tệp đính kèm',
            time: uiMessage.time,
            sortAt: nowIso,
            unread: activeId === conversationId ? undefined : shouldBumpUnread ? (c.unread ?? 0) + 1 : c.unread,
          };
        });
        return sortConversationsByRecent(next);
      });
    },
    [activeId, mergeMessages],
  );

  const patchMessage = useCallback((conversationId: string, messageId: string, patch: Partial<ChatMessage>) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
            }
          : c,
      ),
    );
  }, []);

  const [convPage, setConvPage] = useState(0);
  const [convSize, setConvSize] = useState(20);
  const [convTotal, setConvTotal] = useState(0);
  const [convTotalPages, setConvTotalPages] = useState(0);

  const toUiConversation = useCallback(
    (c: ChatConversationDto): Conversation => {
      const sortAt = c.lastMessageAt || c.createdAt;
      const lastMessage = c.lastMessageContent?.trim() || 'Chưa có tin nhắn';
      return {
        id: c.id,
        type: c.type,
        name: conversationTitle(c),
        roleLabel: conversationRole(c),
        lastMessage,
        time: formatTime(sortAt),
        sortAt,
        peerUserId: c.peerUserId ?? undefined,
        avatarUrl: avatarUrlForUser(c.peerUserId, c.peerAvatarFileId),
        unread: undefined,
        messages: [],
      };
    },
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
        const mapped: Conversation[] = dedupeConversationsByPeer(items.map(toUiConversation));
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
          const merged = dedupeConversationsByPeer([mapped, ...prev]);
          const canonical = mapped.peerUserId
            ? merged.find((c) => c.peerUserId === mapped.peerUserId) ?? mapped
            : mapped;
          setActiveId(canonical.id);
          return merged;
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
        const uiMessages = [...page.items].reverse().map((m) => toUiMessage(m));
        setConversations((prev) =>
          sortConversationsByRecent(
            prev.map((c) =>
              c.id === activeId
                ? {
                    ...c,
                    messages: uiMessages,
                    lastMessage: uiMessages[uiMessages.length - 1]?.text || c.lastMessage,
                    time: uiMessages[uiMessages.length - 1]?.time || c.time,
                    sortAt: page.items[0]?.createdAt || c.sortAt,
                    unread: undefined,
                  }
                : c,
            ),
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
        if (!message.id) return;
        const uiMessage = toUiMessage({
          id: message.id,
          senderId: message.senderId,
          content: message.content,
          type: message.type || 'text',
          edited: message.edited,
          createdAt: message.createdAt,
          attachmentFileIds: message.attachmentFileIds ?? [],
          contextType: message.contextType != null ? String(message.contextType) : null,
          contextId: message.contextId != null ? String(message.contextId) : null,
        });
        upsertMessage(c.id, { ...uiMessage, sendStatus: uiMessage.role === 'me' ? 'sent' : undefined });
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

  const send = async () => {
    const text = draft.trim();
    if (!text || !active) return;

    const clientId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? `pending-${crypto.randomUUID()}`
        : `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const optimistic: ChatMessage = {
      id: clientId,
      role: 'me',
      text,
      time: formatTime(new Date().toISOString()),
      sendStatus: 'sending',
      context: messageContext,
    };

    setDraft('');
    upsertMessage(active.id, optimistic);

    try {
      const saved = await chatService.sendMessage(active.id, {
        content: text,
        type: 'text',
        contextType: messageContext?.contextType,
        contextId: messageContext?.contextId,
      });
      if (saved) {
        upsertMessage(active.id, toUiMessage(saved, 'sent'), { pendingClientId: clientId });
      } else {
        patchMessage(active.id, clientId, { sendStatus: 'failed' });
      }
    } catch (error) {
      patchMessage(active.id, clientId, { sendStatus: 'failed' });
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
    send,
    convPage,
    setConvPage,
    convSize,
    setConvSize,
    convTotal,
    convTotalPages,
    pendingMessageContext: messageContext,
  };
}
