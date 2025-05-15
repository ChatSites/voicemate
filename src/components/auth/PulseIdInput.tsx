
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthStatusIndicator from './AuthStatusIndicator';
import AuthFeedbackMessages from './AuthFeedbackMessages';
import { useAuthPulseIdAvailability } from '@/hooks/useAuthPulseIdAvailability';

interface PulseIdInputProps {
  pulseId: string;
  setPulseId: (pulseId: string) => void;
  pulseIdAvailable: boolean | null;
  setPulseIdAvailable: (isAvailable: boolean | null) => void;
  pulseIdSuggestions: string[];
  setPulseIdSuggestions: (suggestions: string[]) => void;
  registrationInProgress: boolean;
}

const PulseIdInput: React.FC<PulseIdInputProps> = ({
  pulseId,
  setPulseId,
  pulseIdAvailable,
  setPulseIdAvailable,
  pulseIdSuggestions,
  setPulseIdSuggestions,
  registrationInProgress
}) => {
  const [pulseIdTouched, setPulseIdTouched] = useState(false);
  
  const { isCheckingPulseId, refreshCheck } = useAuthPulseIdAvailability({
    pulseId,
    pulseIdTouched,
    setPulseIdAvailable,
    setPulseIdSuggestions,
    registrationInProgress
  });
  
  const handlePulseIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove spaces and convert to lowercase
    const value = e.target.value.trim().replace(/\s+/g, '').toLowerCase();
    setPulseId(value);
    
    // Only mark as touched if user has entered a valid length pulseId or changed an existing value
    if ((value.length >= 3 || (pulseId && value !== pulseId)) && !pulseIdTouched) {
      setPulseIdTouched(true);
    }
  };
  
  const selectSuggestion = (suggestion: string) => {
    setPulseId(suggestion);
    setPulseIdAvailable(true);
    setPulseIdSuggestions([]);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="pulseId">PulseID</Label>
      <div className="relative">
        <Input
          id="pulseId"
          type="text"
          value={pulseId}
          onChange={handlePulseIdChange}
          onBlur={() => {
            if (pulseId.length >= 1) {
              setPulseIdTouched(true);
              if (pulseId.length >= 3) {
                refreshCheck();
              }
            }
          }}
          placeholder="Enter your unique PulseID"
          className="bg-black/30 border-gray-700 pr-10"
          disabled={registrationInProgress}
          required
          data-testid="auth-pulse-id-input"
        />
        
        <AuthStatusIndicator
          isCheckingPulseId={isCheckingPulseId}
          pulseIdAvailable={pulseIdAvailable}
          pulseId={pulseId}
          pulseIdTouched={pulseIdTouched}
          onRefreshCheck={refreshCheck}
        />
      </div>
      
      <AuthFeedbackMessages
        pulseId={pulseId}
        pulseIdTouched={pulseIdTouched}
        pulseIdAvailable={pulseIdAvailable}
        isCheckingPulseId={isCheckingPulseId}
        pulseIdSuggestions={pulseIdSuggestions}
        onSelectSuggestion={selectSuggestion}
      />
    </div>
  );
};

export default PulseIdInput;
