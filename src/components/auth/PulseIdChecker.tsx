
import React from 'react';
import { Button } from '@/components/ui/button';
import { CircleCheck, CircleX } from 'lucide-react';

type PulseIdCheckerProps = {
  pulseIdAvailable: boolean | null;
  pulseIdSuggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  registrationInProgress: boolean;
  isCheckingPulseId: boolean;
};

const PulseIdChecker: React.FC<PulseIdCheckerProps> = ({
  pulseIdAvailable,
  pulseIdSuggestions,
  onSelectSuggestion,
  registrationInProgress,
  isCheckingPulseId
}) => {
  // Show status icon based on availability
  const renderStatusIcon = () => {
    if (isCheckingPulseId) {
      return <div className="h-4 w-4 border-2 border-t-transparent border-voicemate-purple rounded-full animate-spin"></div>;
    } else if (pulseIdAvailable === true) {
      return <CircleCheck className="h-4 w-4 text-green-500" />;
    } else if (pulseIdAvailable === false) {
      return <CircleX className="h-4 w-4 text-red-500" />;
    }
    return null;
  };
  
  // Only show suggestions when pulseIdAvailable is explicitly false
  const shouldShowSuggestions = pulseIdAvailable === false && pulseIdSuggestions.length > 0;

  return (
    <div className="mt-2">
      {renderStatusIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {renderStatusIcon()}
        </div>
      )}
      
      {shouldShowSuggestions && (
        <>
          <p className="text-sm text-amber-400 mb-1">This PulseID is already taken. Try one of these:</p>
          <div className="flex flex-wrap gap-2">
            {pulseIdSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                type="button"
                size="sm"
                variant="outline"
                className="text-xs border-voicemate-purple text-voicemate-purple hover:bg-voicemate-purple/20"
                onClick={() => onSelectSuggestion(suggestion)}
                disabled={registrationInProgress}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PulseIdChecker;
