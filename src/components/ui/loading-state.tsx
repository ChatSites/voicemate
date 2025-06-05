
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  size = 'md',
  className,
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
        <div className="text-center">
          <Loader2 className={cn("animate-spin mx-auto mb-4 text-voicemate-purple", sizeClasses[size])} />
          <p className={cn("text-white", textSizeClasses[size])}>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-6", className)}>
      <Loader2 className={cn("animate-spin mb-2 text-voicemate-purple", sizeClasses[size])} />
      <p className={cn("text-gray-400", textSizeClasses[size])}>{message}</p>
    </div>
  );
};

export default LoadingState;
