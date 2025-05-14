
import React from 'react';
import { Loader2 } from 'lucide-react';

interface DashboardLoadingProps {
  message: string;
}

const DashboardLoading: React.FC<DashboardLoadingProps> = ({ message }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-voicemate-purple" />
        <p className="text-white">{message}</p>
      </div>
    </div>
  );
};

export default DashboardLoading;
