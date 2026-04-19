'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Lỗi Global:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Đã xảy ra lỗi không mong muốn!</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        Hệ thống vừa gặp sự cố trong quá trình xử lý yêu cầu của bạn. 
        Vui lòng thử lại.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} variant="outline">
          Tải lại trang
        </Button>
        <Button onClick={() => reset()}>
          Thử lại
        </Button>
      </div>
    </div>
  );
}
