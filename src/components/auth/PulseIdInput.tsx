
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import { FormFeedback } from '@/components/ui/form-feedback';
import { isPulseIdTaken } from '@/integrations/supabase/client';
import PulseIdSuggestions from './PulseIdSuggestions';

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
  const lastCheckedPulseIdRef = useRef<string>('');

  // Check PulseID availability without causing infinite loops
  useEffect(() => {
    // Skip checks if pulseId doesn't meet minimum requirements or not touched yet or registration in progress
    if (!pulseId || pulseId.length < 3 || registrationInProgress || !pulseIdTouched) {
      return;
    }
    
    // Skip if we already checked this exact pulse ID recently
    if (lastCheckedPulseIdRef.current === pulseId) {
      return;
    }
    
    // Clear any existing timeout to prevent multiple checks
    if (pulseIdCheckTimeoutRef.current) {
      clearTimeout(pulseIdCheckTimeoutRef.current);
    }
    
    setIsCheckingPulseId(true);
    setPulseIdAvailable(null);
    
    // Use timeout to debounce and prevent excessive API calls
    pulseIdCheckTimeoutRef.current = setTimeout(async () => {
      try {
        lastCheckedPulseIdRef.current = pulseId;
        const isTaken = await isPulseIdTaken(pulseId);
        
        if (isTaken) {
          // If taken, generate some alternative suggestions
          const suggestions = [
            `${pulseId}${Math.floor(Math.random() * 1000)}`,
            `${pulseId}_${Math.floor(Math.random() * 100)}`,
            `${pulseId}.${new Date().getFullYear() % 100}`
          ];
          
          setPulseIdSuggestions(suggestions);
          setPulseIdAvailable(false);
        } else {
          setPulseIdAvailable(true);
          setPulseIdSuggestions([]);
        }
      } catch (error) {
        console.error('Error checking PulseID:', error);
        // On error, assume ID is not taken to avoid blocking registration
        setPulseIdAvailable(true);
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
    const value = e.target.value.trim().replace(/\s+/g, '').toLowerCase();
    setPulseId(value);
    
    // Only mark as touched if user has entered a valid length pulseId
    if (value.length >= 3 && !pulseIdTouched) {
      setPulseIdTouched(true);
    }
  };
  
  const selectSuggestion = (suggestion: string) => {
    setPulseId(suggestion);
    lastCheckedPulseIdRef.current = suggestion; // Update the last checked ref
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
        />
        {isCheckingPulseId && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 text-voicemate-purple animate-spin" />
          </div>
        )}
        {!isCheckingPulseId && pulseIdAvailable !== null && pulseId.length >= 3 && pulseIdTouched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {pulseIdAvailable ? (
              <CircleCheck className="h-4 w-4 text-green-500" />
            ) : (
              <CircleX className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      
      {pulseIdTouched && pulseId.length > 0 && pulseId.length < 3 && (
        <FormFeedback variant="warning">
          PulseID must be at least 3 characters
        </FormFeedback>
      )}
      
      {pulseIdTouched && !pulseIdAvailable && !isCheckingPulseId && pulseId.length >= 3 && (
        <FormFeedback variant="error">
          This PulseID is already taken
        </FormFeedback>
      )}
      
      {pulseIdSuggestions.length > 0 && (
        <PulseIdSuggestions 
          suggestions={pulseIdSuggestions}
          onSelect={selectSuggestion}
        />
      )}
      
      {pulseIdTouched && pulseIdAvailable && !isCheckingPulseId && pulseId.length >= 3 && (
        <FormFeedback variant="success">
          This PulseID is available!
        </FormFeedback>
      )}
    </div>
  );
};

export default PulseIdInput;
