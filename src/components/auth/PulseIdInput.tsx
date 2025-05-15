
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import FormFeedback from '@/components/ui/form-feedback';
import PulseIdSuggestions from './PulseIdSuggestions';
import { checkPulseIdAvailability, forceRefreshNextCheck } from '@/services/pulseIdService';

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
  const [errorCount, setErrorCount] = useState(0);
  const pulseIdCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRun = useRef(true);

  // Force refresh on component mount
  useEffect(() => {
    forceRefreshNextCheck();
  }, []);

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
        // Use the shared service for consistent validation with cache skip if errors
        const skipCache = errorCount > 0;
        const result = await checkPulseIdAvailability(pulseId, skipCache);
        
        console.log(`Auth Component: Result for ${pulseId}: ${result.available ? 'available' : 'unavailable'}`);
        
        // If we've had errors and the result is not what we expect, increment error count
        if (errorCount > 0 && result.available) {
          setErrorCount(prev => prev + 1);
          // If multiple errors, force refresh and try again
          if (errorCount >= 2) {
            console.log("Auth Component: Multiple errors detected, forcing refresh");
            forceRefreshNextCheck();
            // Wait a moment and retry
            setTimeout(async () => {
              const finalResult = await checkPulseIdAvailability(pulseId, true);
              setPulseIdAvailable(finalResult.available);
              setPulseIdSuggestions(finalResult.available ? [] : finalResult.suggestions);
            }, 100);
          }
        } else {
          // Reset error count on success
          if (errorCount > 0) setErrorCount(0);
        }
        
        setPulseIdAvailable(result.available);
        setPulseIdSuggestions(result.available ? [] : result.suggestions);
      } catch (error) {
        console.error('Auth Component: Error checking PulseID:', error);
        // On error, assume ID is available to avoid blocking registration
        setPulseIdAvailable(null);
        setErrorCount(prev => prev + 1);
      } finally {
        setIsCheckingPulseId(false);
      }
    }, 500);
    
    return () => {
      if (pulseIdCheckTimeoutRef.current) {
        clearTimeout(pulseIdCheckTimeoutRef.current);
      }
    };
  }, [pulseId, registrationInProgress, pulseIdTouched, setPulseIdAvailable, setPulseIdSuggestions, errorCount]);
  
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
  
  const refreshCheck = () => {
    if (pulseId && pulseId.length >= 3 && !registrationInProgress) {
      forceRefreshNextCheck();
      setErrorCount(0);
      setIsCheckingPulseId(true);
      // Force a fresh check
      checkPulseIdAvailability(pulseId, true).then(result => {
        setPulseIdAvailable(result.available);
        setPulseIdSuggestions(result.available ? [] : result.suggestions);
        setIsCheckingPulseId(false);
      }).catch(() => {
        setIsCheckingPulseId(false);
      });
    }
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
        {isCheckingPulseId && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 text-voicemate-purple animate-spin" />
          </div>
        )}
        {!isCheckingPulseId && pulseIdAvailable !== null && pulseId.length >= 3 && pulseIdTouched && (
          <div 
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" 
            data-testid="auth-availability-indicator"
            onClick={refreshCheck}
            title="Click to refresh check"
          >
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
