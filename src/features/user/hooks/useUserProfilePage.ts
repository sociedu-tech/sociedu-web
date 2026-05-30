import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePublicProfile } from './usePublicProfile';
import { useAuth } from '@/context/AuthContext';

export function useUserProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
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

  const handleMessage = () => {
    if (!isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent(`/profile/${id}`)}`);
      return;
    }
    router.push('/dashboard/chat');
  };

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
