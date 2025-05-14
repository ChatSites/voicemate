
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import { isPulseIdTaken } from '@/integrations/supabase/client';
import PulseIdSuggestions from './PulseIdSuggestions';
import FormFeedback from '@/components/ui/form-feedback';

type PulseIdInputProps = {
  pulseId: string;
  setPulseId: (pulseId: string) => void;
  pulseIdAvailable: boolean | null;
  setPulseIdAvailable: (available: boolean | null) => void;
  pulseIdSuggestions: string[];
  setPulseIdSuggestions: (suggestions: string[]) => void;
  registrationInProgress: boolean;
};

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
  
  // Check PulseID availability without causing infinite loops
  useEffect(() => {
    // Skip checks if pulseId doesn't meet minimum requirements or registration is in progress
    if (!pulseId || pulseId.length < 3 || registrationInProgress) {
      return;
    }
    
    // Mark touched if user has entered a valid length pulseId
    if (!pulseIdTouched && pulseId.length >= 3) {
      setPulseIdTouched(true);
    }
    
    // Clear any existing timeout to prevent multiple checks
    if (pulseIdCheckTimeoutRef.current) {
      clearTimeout(pulseIdCheckTimeoutRef.current);
    }
    
    // Set checking state and start availability check
    setIsCheckingPulseId(true);
    
    // Create a local variable to store the current pulseId being checked
    const currentPulseId = pulseId;
    
    pulseIdCheckTimeoutRef.current = setTimeout(async () => {
      try {
        // Only run the check if pulseId hasn't changed during the timeout
        if (currentPulseId === pulseId) {
          const isTaken = await isPulseIdTaken(pulseId);
          
          // Update state only if pulseId still matches what we checked
          if (currentPulseId === pulseId) {
            setPulseIdAvailable(!isTaken);
            
            if (isTaken) {
              const suggestions = [
                `${pulseId}_${Math.floor(Math.random() * 1000)}`,
                `${pulseId}${Date.now().toString().slice(-4)}`,
                `${pulseId}123`,
              ];
              setPulseIdSuggestions(suggestions);
            } else {
              setPulseIdSuggestions([]);
            }
          }
        }
      } catch (error) {
        console.error('Error checking PulseID availability:', error);
        // On error, assume ID is available to avoid blocking registration
        if (currentPulseId === pulseId) {
          setPulseIdAvailable(true);
          setPulseIdSuggestions([]);
        }
      } finally {
        // Only update checking state if pulseId hasn't changed
        if (currentPulseId === pulseId) {
          setIsCheckingPulseId(false);
        }
      }
    }, 600);
    
    return () => {
      if (pulseIdCheckTimeoutRef.current) {
        clearTimeout(pulseIdCheckTimeoutRef.current);
      }
    };
  }, [pulseId, registrationInProgress]);
  
  const handlePulseIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().replace(/\s+/g, '').toLowerCase();
    setPulseId(value);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setPulseId(suggestion);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="pulseid">VoiceMate ID</Label>
      <div className="relative">
        <Input 
          id="pulseid" 
          type="text" 
          placeholder="yourname" 
          className="bg-black/30 border-gray-700 text-white"
          value={pulseId}
          onChange={handlePulseIdChange}
          onBlur={() => setPulseIdTouched(true)}
          required
          disabled={registrationInProgress}
        />
        {isCheckingPulseId && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 text-voicemate-purple animate-spin" />
          </div>
        )}
        {!isCheckingPulseId && pulseIdAvailable !== null && pulseId.length >= 3 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {pulseIdAvailable ? (
              <CircleCheck className="h-4 w-4 text-green-500" />
            ) : (
              <CircleX className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400">
        Choose a unique ID for your VoiceMate. This will be your identity on the platform.
      </p>
      {pulseIdTouched && pulseId.length > 0 && pulseId.length < 3 && (
        <FormFeedback
          type="warning"
          message="ID must be at least 3 characters"
        />
      )}
      {pulseIdAvailable === false && pulseIdSuggestions.length > 0 && (
        <PulseIdSuggestions 
          suggestions={pulseIdSuggestions}
          onSelectSuggestion={handleSuggestionClick}
        />
      )}
    </div>
  );
};

export default PulseIdInput;
