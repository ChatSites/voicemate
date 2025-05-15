
import React from 'react';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';

interface AuthStatusIndicatorProps {
  isCheckingPulseId: boolean;
  pulseIdAvailable: boolean | null;
  pulseId: string;
  pulseIdTouched: boolean;
  onRefreshCheck: () => void;
}

const AuthStatusIndicator: React.FC<AuthStatusIndicatorProps> = ({ 
  isCheckingPulseId, 
  pulseIdAvailable, 
  pulseId,
  pulseIdTouched,
  onRefreshCheck
}) => {
  // Don't show anything if pulseId is too short or not touched
  if (!pulseIdTouched || pulseId.length < 3) {
    return null;
  }

  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2">
      {isCheckingPulseId ? (
        <Loader2 className="h-4 w-4 text-voicemate-purple animate-spin" />
      ) : (
        pulseIdAvailable !== null && (
          <div 
            className="cursor-pointer" 
            data-testid="auth-availability-indicator"
            onClick={onRefreshCheck}
            title="Click to refresh check"
          >
            {pulseIdAvailable ? (
              <CircleCheck className="h-4 w-4 text-green-500" />
            ) : (
              <CircleX className="h-4 w-4 text-red-500" />
            )}
          </div>
        )
      )}
    </div>
  );
};

export default AuthStatusIndicator;
