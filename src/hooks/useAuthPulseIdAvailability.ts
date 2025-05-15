
import { useState, useEffect, useRef } from 'react';
import { checkPulseIdAvailability, forceRefreshNextCheck } from '@/services/pulseIdService';
import { toast } from "@/hooks/use-toast";

type UseAuthPulseIdAvailabilityProps = {
  pulseId: string;
  pulseIdTouched: boolean;
  setPulseIdAvailable: (available: boolean | null) => void;
  setPulseIdSuggestions: (suggestions: string[]) => void;
  registrationInProgress: boolean;
}

export const useAuthPulseIdAvailability = ({ 
  pulseId, 
  pulseIdTouched,
  setPulseIdAvailable,
  setPulseIdSuggestions,
  registrationInProgress
}: UseAuthPulseIdAvailabilityProps) => {
  const [isCheckingPulseId, setIsCheckingPulseId] = useState(false);
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
        toast({
          title: "Error",
          description: "Could not check PulseID availability. Please try again.",
          variant: "destructive"
        });
      });
    }
  };

  return {
    isCheckingPulseId,
    refreshCheck
  };
};
