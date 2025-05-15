
import React from 'react';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';

interface StatusIndicatorProps {
  isChecking: boolean;
  isAvailable: boolean | null;
  pulseId: string;
  onRefreshCheck: () => void;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  isChecking, 
  isAvailable, 
  pulseId,
  onRefreshCheck
}) => {
  // Don't show anything if we're not checking and we don't have a result or ID is too short
  if ((!isChecking && isAvailable === null) || pulseId.length < 3) {
    return null;
  }

  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2">
      {isChecking ? (
        <Loader2 className="h-4 w-4 text-voicemate-purple animate-spin" />
      ) : (
        <div 
          className="cursor-pointer" 
          data-testid="availability-indicator"
          onClick={onRefreshCheck}
          title="Click to refresh check"
        >
          {isAvailable === true && (
            <CircleCheck className="h-4 w-4 text-green-500" />
          )}
          {isAvailable === false && (
            <CircleX className="h-4 w-4 text-red-500" />
          )}
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
