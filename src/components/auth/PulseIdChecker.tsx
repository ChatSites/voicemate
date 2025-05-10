
import React from 'react';
import { Button } from '@/components/ui/button';

type PulseIdCheckerProps = {
  pulseIdAvailable: boolean;
  pulseIdSuggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  registrationInProgress: boolean;
};

const PulseIdChecker: React.FC<PulseIdCheckerProps> = ({
  pulseIdAvailable,
  pulseIdSuggestions,
  onSelectSuggestion,
  registrationInProgress
}) => {
  if (pulseIdAvailable !== false) {
    return null;
  }

  return (
    <div className="mt-2">
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
    </div>
  );
};

export default PulseIdChecker;
