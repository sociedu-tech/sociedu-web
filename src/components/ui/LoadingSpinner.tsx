import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className, 
  size = 24, 
  label = "Đang tải..." 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <Loader2 className="animate-spin text-primary" size={size} />
      {label && <p className="mt-2 text-sm text-muted-foreground font-medium">{label}</p>}
    </div>
  );
};
