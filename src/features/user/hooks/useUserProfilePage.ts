import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePublicProfile } from './usePublicProfile';
import { useAuth } from '@/context/AuthContext';
import { buildChatThreadUrl, resolveDirectUserConversation } from '@/features/dashboard/lib/directUserChat';
import { useToast } from '@/context/ToastContext';

export function useUserProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, user: currentUser } = useAuth();
  const { user, isMentor, packages, reviews, ratingSummary, loading, error, refetch } =
    usePublicProfile(id);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'reviews'>('about');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const isOwnProfile = currentUser?.id?.toString() === id;

  const handleConnect = () => {
    if (!isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent(`/profile/${id}/book`)}`);
      return;
    }
    router.push(`/profile/${id}/book`);
  };

  const handleMessage = useCallback(async () => {
    if (!isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent(`/profile/${id}`)}`);
      return;
    }
    if (isOwnProfile) {
      return;
    }
    try {
      const conversationId = await resolveDirectUserConversation(id);
      const peerName = user?.name?.trim() || 'Người dùng';
      router.push(buildChatThreadUrl(conversationId, peerName));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không mở được hội thoại.');
    }
  }, [id, isAuthenticated, isOwnProfile, router, toast, user?.name]);

  return {
    id,
    user,
    isMentor,
    packages,
    reviews,
    ratingSummary,
    loading,
    error,
    refetch,
    isReportModalOpen,
    setIsReportModalOpen,
    activeTab,
    setActiveTab,
    isOwnProfile,
    handleConnect,
    handleMessage,
  };
}
