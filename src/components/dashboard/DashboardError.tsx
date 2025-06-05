
import React from 'react';
import ErrorState from '@/components/ui/error-state';

interface DashboardErrorProps {
  error: string;
  onRetry?: () => void;
}

const DashboardError: React.FC<DashboardErrorProps> = ({ error, onRetry }) => {
  return (
    <ErrorState
      fullScreen
      title="Dashboard Error"
      message={error}
      onRetry={onRetry}
      showRetry={!!onRetry}
    />
  );
};

export default DashboardError;
