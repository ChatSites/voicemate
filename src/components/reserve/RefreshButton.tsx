
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  pulseId: string;
  isChecking: boolean;
  onRefresh: () => void;
  showButton: boolean;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ 
  pulseId, 
  isChecking, 
  onRefresh,
  showButton
}) => {
  if (!showButton || pulseId.length < 3) {
    return null;
  }

  return (
    <div className="flex justify-end mt-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onRefresh}
        className="text-xs flex items-center gap-1 text-voicemate-purple hover:text-voicemate-purple/80"
        disabled={isChecking}
      >
        <RefreshCw className="h-3 w-3" />
        Refresh check
      </Button>
    </div>
  );
};

export default RefreshButton;
