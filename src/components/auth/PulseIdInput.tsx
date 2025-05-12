
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import { isPulseIdTaken } from '@/integrations/supabase/client';
import PulseIdSuggestions from './PulseIdSuggestions';

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
  
  // Memoized check function to avoid recreation on every render
  const checkPulseIdAvailability = useCallback(async (id: string) => {
    if (!id || id.length < 3 || registrationInProgress) return;
    
    setIsCheckingPulseId(true);
    try {
      console.log('Checking if PulseID is available:', id);
      const isTaken = await isPulseIdTaken(id);
      console.log('PulseID check result:', id, isTaken ? 'taken' : 'available');
      
      setPulseIdAvailable(!isTaken);
      
      if (isTaken) {
        // Generate suggestions if ID is taken
        const suggestions = [
          `${id}_${Math.floor(Math.random() * 1000)}`,
          `${id}${Date.now().toString().slice(-4)}`,
          `${id}123`,
        ];
        setPulseIdSuggestions(suggestions);
      } else {
        setPulseIdSuggestions([]);
      }
    } catch (error) {
      console.error('Error checking PulseID availability:', error);
      // On error, assume ID is available to avoid blocking registration
      setPulseIdAvailable(true);
    } finally {
      setIsCheckingPulseId(false);
    }
  }, [setPulseIdAvailable, setPulseIdSuggestions, registrationInProgress]);
  
  // Use effect with proper dependency array to prevent infinite loops
  useEffect(() => {
    if (!pulseIdTouched || pulseId.length < 3) return;
    
    const timerId = setTimeout(() => {
      checkPulseIdAvailability(pulseId);
    }, 600);
    
    return () => clearTimeout(timerId);
  }, [pulseId, pulseIdTouched, checkPulseIdAvailability]);
  
  const handlePulseIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().replace(/\s+/g, '').toLowerCase();
    setPulseId(value);
    
    if (!pulseIdTouched && value.length > 0) {
      setPulseIdTouched(true);
    }
    
    // Reset availability state when user types
    if (pulseIdAvailable !== null) {
      setPulseIdAvailable(null);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setPulseId(suggestion);
    // Check availability of the selected suggestion
    checkPulseIdAvailability(suggestion);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="pulseid">VoiceMate ID</Label>
      <div className="relative">
        <Input 
          id="pulseid" 
          type="text" 
          placeholder="yourname" 
          className={`bg-black/30 border-gray-700 ${
            pulseIdAvailable === false ? "border-red-500" : 
            pulseIdAvailable === true ? "border-green-500" : ""
          }`}
          value={pulseId}
          onChange={handlePulseIdChange}
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
        <p className="text-sm text-amber-400">ID must be at least 3 characters</p>
      )}
      {pulseIdAvailable === false && pulseIdSuggestions.length > 0 && (
        <PulseIdSuggestions 
          suggestions={pulseIdSuggestions}
          onSuggestionClick={handleSuggestionClick}
        />
      )}
    </div>
  );
};

export default PulseIdInput;
