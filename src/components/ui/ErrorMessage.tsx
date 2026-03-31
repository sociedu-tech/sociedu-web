import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = "Đã có lỗi xảy ra. Vui lòng thử lại sau.", 
  onRetry,
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 bg-red-50 border border-red-100 rounded-xl", 
      className
    )}>
      <AlertCircle className="text-red-500 mb-3" size={32} />
      <p className="text-red-700 text-center font-medium mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
        >
          <RefreshCw size={16} />
          Thử lại
        </button>
      )}
    </div>
  );
};
