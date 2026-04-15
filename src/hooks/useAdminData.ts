import { useState, useEffect } from 'react';
import type { User, Product } from '@/types';
import { adminService } from '@/services/adminService';

export const useAdminData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    users: User[];
    mentorRequests: User[];
    productRequests: Product[];
    updateRequests: Product[];
  }>({
    users: [],
    mentorRequests: [],
    productRequests: [],
    updateRequests: []
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mentorRequests, productRequests, updateRequests] = await Promise.all([
        adminService.getMentorRequests(),
        adminService.getProductRequests(),
        adminService.getUpdateRequests()
      ]);

      setData({
        users: [], // We'll skip full user list for now
        mentorRequests,
        productRequests,
        updateRequests
      });
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu quản trị');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveMentor = async (id: string) => {
    try {
      await adminService.approveMentor(id);
      await fetchData();
    } catch (err: any) {
      throw new Error(err.message || 'Lỗi khi duyệt mentor');
    }
  };

  const approveProduct = async (id: number) => {
    try {
      await adminService.approveProduct(id.toString());
      await fetchData();
    } catch (err: any) {
      throw new Error(err.message || 'Lỗi khi duyệt tài liệu');
    }
  };

  const approveUpdate = async (id: number) => {
    try {
      await adminService.approveUpdate(id.toString());
      await fetchData();
    } catch (err: any) {
      throw new Error(err.message || 'Lỗi khi duyệt cập nhật');
    }
  };

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    approveMentor,
    approveProduct,
    approveUpdate
  };
};
