
import { useState, useEffect, useRef } from 'react';
import { checkPulseIdAvailability, forceRefreshNextCheck } from '@/services/pulseIdService';
import { toast } from "@/hooks/use-toast";

type UsePulseIdAvailabilityProps = {
  pulseId: string;
  touched: boolean;
  setPulseIdAvailable: (available: boolean | null) => void;
}

export const usePulseIdAvailability = ({ 
  pulseId, 
  touched,
  setPulseIdAvailable 
}: UsePulseIdAvailabilityProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [errorCount, setErrorCount] = useState(0);
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRun = useRef(true);
  
  // Initial force refresh to ensure we get fresh data
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
    
    if (!pulseId || pulseId.length < 3 || !touched) {
      setIsAvailable(null);
      setPulseIdAvailable(null);
      return;
    }
    
    // Clear any existing timeout
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }
    
    setIsChecking(true);
    console.log(`Starting availability check for: ${pulseId}`);
    
    // Debounce to avoid too many API calls
    checkTimeoutRef.current = setTimeout(async () => {
      try {
        console.log(`Performing check for: ${pulseId}`);
        // Use the shared service with cache skipping if we've had errors
        const skipCache = errorCount > 0;
        const result = await checkPulseIdAvailability(pulseId, skipCache);
        
        if (result.available === null) {
          // Error case - handled by toast in the service
          setErrorCount(prev => prev + 1);
          setIsAvailable(null);
          setPulseIdAvailable(null);
          setShowRefreshButton(true);
        } else {
          console.log(`Result for ${pulseId}: ${result.available ? 'available' : 'unavailable'}`);
          
          // Reset error count if success after errors
          if (errorCount > 0) setErrorCount(0);
          
          setIsAvailable(result.available);
          setPulseIdAvailable(result.available);
          setSuggestions(result.suggestions);
          setShowRefreshButton(true); // Show refresh button after first check
        }
      } catch (error) {
        console.error('Error checking PulseID availability:', error);
        setIsAvailable(null);
        setPulseIdAvailable(null);
        setErrorCount(prev => prev + 1);
        setShowRefreshButton(true); // Show refresh button on error too
        
        toast({
          title: "Connection Error",
          description: "Could not check availability. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsChecking(false);
      }
    }, 600);
    
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [pulseId, touched, setPulseIdAvailable, errorCount]);

  const refreshCheck = () => {
    if (pulseId && pulseId.length >= 3) {
      forceRefreshNextCheck();
      setErrorCount(0);
      setIsChecking(true);
      
      // Immediate check with cache bypass
      checkPulseIdAvailability(pulseId, true).then(result => {
        if (result.available === null) {
          // Error case - handled by toast in the service
          setIsAvailable(null);
          setPulseIdAvailable(null);
        } else {
          setIsAvailable(result.available);
          setPulseIdAvailable(result.available);
          setSuggestions(result.suggestions);
          
          // Show toast to confirm successful check
          toast({
            title: "Check Complete",
            description: result.available ? 
              "This PulseID is available!" : 
              "This PulseID is already taken.",
            variant: result.available ? "default" : "destructive"
          });
        }
        setIsChecking(false);
      }).catch(() => {
        setIsChecking(false);
        toast({
          title: "Error",
          description: "Failed to check availability. Please try again.",
          variant: "destructive"
        });
      });
    }
  };

  return {
    isChecking,
    isAvailable,
    suggestions,
    showRefreshButton,
    refreshCheck
  };
};
