
import React from 'react';
import LoadingState from '@/components/ui/loading-state';

interface DashboardLoadingProps {
  message: string;
}

const DashboardLoading: React.FC<DashboardLoadingProps> = ({ message }) => {
  return (
    <LoadingState
      fullScreen
      message={message}
      size="lg"
    />
  );
};

export default DashboardLoading;
