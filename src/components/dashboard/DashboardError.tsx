
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

interface DashboardErrorProps {
  message: string;
}

const DashboardError: React.FC<DashboardErrorProps> = ({ message }) => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold text-white mb-2">Profile Error</h2>
          <p className="text-gray-300 mb-4">{message}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardError;
