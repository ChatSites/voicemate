
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import FormFeedback from '@/components/ui/form-feedback';
import PulseIdSuggestions from './PulseIdSuggestions';
import { checkPulseIdAvailability } from '@/services/pulseIdService';

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
  const [isCheckingPulseId, setIsCheckingPulseId] = useState(false);
  const [pulseIdTouched, setPulseIdTouched] = useState(false);
  const pulseIdCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRun = useRef(true);

  // Check PulseID availability whenever it changes
  useEffect(() => {
    // Skip the first run to avoid immediate checks on component mount
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    
    // Skip checks if pulseId doesn't meet minimum requirements or not touched yet or registration in progress
    if (!pulseId || pulseId.length < 3 || registrationInProgress || !pulseIdTouched) {
      return;
    }
    
    // Clear any existing timeout to prevent multiple checks
    if (pulseIdCheckTimeoutRef.current) {
      clearTimeout(pulseIdCheckTimeoutRef.current);
    }
    
    setIsCheckingPulseId(true);
    console.log(`Auth Component: Starting availability check for: ${pulseId}`);
    
    // Debounce to avoid excessive API calls
    pulseIdCheckTimeoutRef.current = setTimeout(async () => {
      try {
        console.log(`Auth Component: Performing check for: ${pulseId}`);
        // Use the shared service for consistent validation
        const result = await checkPulseIdAvailability(pulseId);
        
        console.log(`Auth Component: Result for ${pulseId}: ${result.available ? 'available' : 'unavailable'}`);
        
        setPulseIdAvailable(result.available);
        setPulseIdSuggestions(result.available ? [] : result.suggestions);
      } catch (error) {
        console.error('Auth Component: Error checking PulseID:', error);
        // On error, assume ID is available to avoid blocking registration
        setPulseIdAvailable(null);
      } finally {
        setIsCheckingPulseId(false);
      }
    }, 500);
    
    return () => {
      if (pulseIdCheckTimeoutRef.current) {
        clearTimeout(pulseIdCheckTimeoutRef.current);
      }
    };
  }, [pulseId, registrationInProgress, pulseIdTouched, setPulseIdAvailable, setPulseIdSuggestions]);
  
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
          onBlur={() => pulseId.length >= 1 && setPulseIdTouched(true)}
          placeholder="Enter your unique PulseID"
          className="bg-black/30 border-gray-700 pr-10"
          disabled={registrationInProgress}
          required
          data-testid="auth-pulse-id-input"
        />
        {isCheckingPulseId && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 text-voicemate-purple animate-spin" />
          </div>
        )}
        {!isCheckingPulseId && pulseIdAvailable !== null && pulseId.length >= 3 && pulseIdTouched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2" data-testid="auth-availability-indicator">
            {pulseIdAvailable ? (
              <CircleCheck className="h-4 w-4 text-green-500" />
            ) : (
              <CircleX className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      
      {pulseIdTouched && pulseId.length > 0 && pulseId.length < 3 && (
        <FormFeedback
          type="warning"
          message="PulseID must be at least 3 characters"
        />
      )}
      
      {pulseIdTouched && pulseIdAvailable === false && !isCheckingPulseId && pulseId.length >= 3 && (
        <FormFeedback
          type="error"
          message="This PulseID is already taken"
        />
      )}
      
      {pulseIdSuggestions.length > 0 && (
        <PulseIdSuggestions 
          suggestions={pulseIdSuggestions}
          onSelectSuggestion={selectSuggestion}
        />
      )}
      
      {pulseIdTouched && pulseIdAvailable === true && !isCheckingPulseId && pulseId.length >= 3 && (
        <FormFeedback
          type="success"
          message="This PulseID is available!"
          data-testid="auth-available-message"
        />
      )}
    </div>
  );
};

export default PulseIdInput;
