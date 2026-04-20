import { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { useUserProfile } from './useUserProfile';
import { useAuth } from '@/context/AuthContext';

export function useUserProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { isAuthenticated, user: currentUser } = useAuth();
  const { user, loading, error, refetch } = useUserProfile(id);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'activity'>('about');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const userProducts: Product[] = [];

  const isOwnProfile = currentUser?.id?.toString() === id;

  const handleContactClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent(`/profile/${id}`)}`);
      return;
    }
    setIsContactModalOpen(true);
  };

  return {
    id,
    user,
    loading,
    error,
    refetch,
    isReportModalOpen,
    setIsReportModalOpen,
    isContactModalOpen,
    setIsContactModalOpen,
    activeTab,
    setActiveTab,
    userProducts,
    isOwnProfile,
    handleContactClick,
  };
}
