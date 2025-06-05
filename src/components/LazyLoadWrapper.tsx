
import React, { Suspense } from 'react';
import LoadingState from '@/components/ui/loading-state';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({ 
  children, 
  fallback = <LoadingState fullScreen message="Loading page..." size="lg" />
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default LazyLoadWrapper;
