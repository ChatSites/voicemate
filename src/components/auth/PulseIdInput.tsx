
import React, { useState, useEffect } from 'react';
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
  
  // Check PulseID availability whenever it changes
  useEffect(() => {
    if (!pulseId || pulseId.length < 3 || registrationInProgress) {
      return;
    }
    
    if (!pulseIdTouched) {
      setPulseIdTouched(true);
    }
    
    // Reset availability state when typing
    setPulseIdAvailable(null);
    
    setIsCheckingPulseId(true);
    
    const checkPulseIdAvailability = async () => {
      try {
        console.log('Checking if PulseID is available:', pulseId);
        const isTaken = await isPulseIdTaken(pulseId);
        console.log('PulseID check result:', pulseId, isTaken ? 'taken' : 'available');
        
        setPulseIdAvailable(!isTaken);
        
        if (isTaken) {
          // Generate suggestions if ID is taken
          const suggestions = [
            `${pulseId}_${Math.floor(Math.random() * 1000)}`,
            `${pulseId}${Date.now().toString().slice(-4)}`,
            `${pulseId}123`,
          ];
          setPulseIdSuggestions(suggestions);
        } else {
          setPulseIdSuggestions([]);
        }
      } catch (error) {
        console.error('Error checking PulseID availability:', error);
        // On error, assume ID is available to avoid blocking registration
        setPulseIdAvailable(true);
        setPulseIdSuggestions([]);
      } finally {
        setIsCheckingPulseId(false);
      }
    };
    
    // Debounce the check to avoid too many requests
    const timerId = setTimeout(checkPulseIdAvailability, 600);
    return () => clearTimeout(timerId);
  }, [pulseId, pulseIdTouched, setPulseIdAvailable, setPulseIdSuggestions, registrationInProgress]);
  
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
