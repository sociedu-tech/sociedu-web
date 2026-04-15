import { useState, useEffect } from 'react';
import { mentorService } from '@/services/mentorService';

export const useMentorData = (mentorId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>({
    stats: null,
    withdrawals: []
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [stats, withdrawals] = await Promise.all([
        mentorService.getStats(),
        mentorService.getWithdrawals()
      ]);
      setData({ stats, withdrawals });
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu mentor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mentorId]);

  const addPackage = () => {
    const newPkg = {
      id: `p${Date.now()}`,
      title: 'Gói dịch vụ mới',
      description: 'Mô tả chi tiết về gói dịch vụ...',
      price: 100000,
      duration: '1 giờ'
    };
    setData((prev: any) => ({
      ...prev,
      packages: [...(prev.packages || []), newPkg]
    }));
  };

  const removePackage = (id: string | number) => {
    setData((prev: any) => ({
      ...prev,
      packages: prev.packages.filter((p: any) => p.id !== id)
    }));
  };

  const updatePackage = (id: string | number, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      packages: prev.packages.map((p: any) => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const savePackages = async () => {
    try {
      await mentorService.savePackagesForMentor(mentorId, data.packages);
      await fetchData();
    } catch (err: any) {
      throw new Error(err.message || 'Lỗi khi lưu gói dịch vụ');
    }
  };


  return {
    data,
    loading,
    error,
    refresh: fetchData,
    addPackage,
    removePackage,
    updatePackage,
    savePackages
  };
};
