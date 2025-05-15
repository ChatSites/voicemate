
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { CircleCheck, CircleX, Loader2, RefreshCw } from 'lucide-react';
import PulseIdSuggestions from './PulseIdSuggestions';
import FormFeedback from '@/components/ui/form-feedback';
import { useTheme } from '@/components/providers/ThemeProvider';
import { checkPulseIdAvailability, forceRefreshNextCheck } from '@/services/pulseIdService';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast"; // Updated import path

type PulseIdInputProps = {
  pulseId: string;
  setPulseId: (value: string) => void;
  setPulseIdAvailable: (available: boolean | null) => void;
}

const PulseIdInput: React.FC<PulseIdInputProps> = ({
  pulseId,
  setPulseId,
  setPulseIdAvailable
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRun = useRef(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove spaces and convert to lowercase
    const value = e.target.value.trim().replace(/\s+/g, '').toLowerCase();
    setPulseId(value);
    if (!touched && value) {
      setTouched(true);
    }
  };
  
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
  
  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          placeholder="Choose your PulseID"
          value={pulseId}
          onChange={handleChange}
          onBlur={() => {
            setTouched(true);
            if (pulseId && pulseId.length >= 3) {
              refreshCheck();
            }
          }}
          className={`${isDark ? 'bg-black/30 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} pr-10`}
          data-testid="pulse-id-input"
        />
        {isChecking && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 text-voicemate-purple animate-spin" />
          </div>
        )}
        {!isChecking && isAvailable !== null && pulseId.length >= 3 && (
          <div 
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" 
            data-testid="availability-indicator"
            onClick={refreshCheck}
            title="Click to refresh check"
          >
            {isAvailable ? (
              <CircleCheck className="h-4 w-4 text-green-500" />
            ) : (
              <CircleX className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      
      {touched && pulseId.length > 0 && pulseId.length < 3 && (
        <FormFeedback
          type="warning"
          message="ID must be at least 3 characters"
        />
      )}
      
      {isAvailable === false && suggestions.length > 0 && (
        <div className="mt-2">
          <FormFeedback
            type="error"
            message="This PulseID is already taken. Try one of these instead:"
          />
          <PulseIdSuggestions 
            suggestions={suggestions} 
            onSelectSuggestion={(suggestion) => setPulseId(suggestion)} 
          />
        </div>
      )}
      
      {isAvailable === true && pulseId.length >= 3 && (
        <FormFeedback
          type="success"
          message="This PulseID is available!"
          data-testid="available-message"
        />
      )}

      {showRefreshButton && pulseId.length >= 3 && (
        <div className="flex justify-end mt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshCheck}
            className="text-xs flex items-center gap-1 text-voicemate-purple hover:text-voicemate-purple/80"
            disabled={isChecking}
          >
            <RefreshCw className="h-3 w-3" />
            Refresh check
          </Button>
        </div>
      )}
    </div>
  );
};

export default PulseIdInput;
