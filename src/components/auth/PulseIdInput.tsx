
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleX, CircleCheck } from 'lucide-react';
import PulseIdChecker from './PulseIdChecker';
import { isPulseIdTaken } from '@/integrations/supabase/client';

type PulseIdInputProps = {
  pulseId: string;
  setPulseId: (id: string) => void;
  registrationInProgress: boolean;
  pulseIdAvailable: boolean | null;
  setPulseIdAvailable: (available: boolean | null) => void;
  pulseIdSuggestions: string[];
  setPulseIdSuggestions: (suggestions: string[]) => void;
}

const PulseIdInput: React.FC<PulseIdInputProps> = ({
  pulseId,
  setPulseId,
  registrationInProgress,
  pulseIdAvailable,
  setPulseIdAvailable,
  pulseIdSuggestions,
  setPulseIdSuggestions
}) => {
  const [isCheckingPulseId, setIsCheckingPulseId] = useState(false);
  const [lastCheckedPulseId, setLastCheckedPulseId] = useState('');

  // PulseID verification
  useEffect(() => {
    // Skip checking if registration is in progress to avoid UI confusion
    if (registrationInProgress) return;

    const checkPulseId = async () => {
      if (!pulseId || pulseId.length < 3) {
        setPulseIdAvailable(null);
        setPulseIdSuggestions([]);
        return;
      }

      setIsCheckingPulseId(true);
      
      try {
        console.log(`Checking availability for PulseID: ${pulseId}`);
        
        const isTaken = await isPulseIdTaken(pulseId);
        const isAvailable = !isTaken;
        
        console.log(`PulseID ${pulseId} is ${isAvailable ? 'available' : 'taken'}`);
        
        setLastCheckedPulseId(pulseId);
        setPulseIdAvailable(isAvailable);
        
        // Generate suggestions if not available
        if (!isAvailable) {
          const suggestions = [
            `${pulseId}${Math.floor(Math.random() * 100)}`,
            `${pulseId}_${Math.floor(Math.random() * 100)}`,
            `${pulseId}${Math.floor(Math.random() * 900) + 100}`,
          ];
          setPulseIdSuggestions(suggestions);
        } else {
          setPulseIdSuggestions([]);
        }
      } catch (error) {
        console.error('Error checking PulseID:', error);
        setPulseIdAvailable(null);
      } finally {
        setIsCheckingPulseId(false);
      }
    };
    
    // Debounce the check to avoid too many requests
    const timerId = setTimeout(checkPulseId, 500);
    return () => clearTimeout(timerId);
  }, [pulseId, registrationInProgress, setPulseIdAvailable, setPulseIdSuggestions]);

  const selectSuggestion = (suggestion: string) => {
    setPulseId(suggestion);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="pulse-id">Desired PulseID</Label>
      <div className="flex">
        <span className="inline-flex items-center px-3 text-sm bg-black/50 rounded-l-md border border-r-0 border-gray-700 text-gray-400">
          pulse/
        </span>
        <div className="relative flex-1">
          <Input 
            id="pulse-id" 
            placeholder="yourname" 
            className={`rounded-l-none bg-black/30 border-gray-700 ${
              pulseIdAvailable === false ? "border-red-500 pr-9" : 
              pulseIdAvailable === true ? "border-green-500 pr-9" : ""
            }`}
            value={pulseId}
            onChange={(e) => setPulseId(e.target.value)}
            required
            disabled={registrationInProgress}
          />
          {isCheckingPulseId && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 border-2 border-t-transparent border-voicemate-purple rounded-full animate-spin"></div>
            </div>
          )}
          {!isCheckingPulseId && pulseIdAvailable !== null && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {pulseIdAvailable ? (
                <CircleCheck className="h-4 w-4 text-green-500" />
              ) : (
                <CircleX className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
        </div>
      </div>
      
      {pulseIdAvailable === false && (
        <PulseIdChecker 
          pulseIdAvailable={pulseIdAvailable}
          pulseIdSuggestions={pulseIdSuggestions}
          onSelectSuggestion={selectSuggestion}
          registrationInProgress={registrationInProgress}
          isCheckingPulseId={isCheckingPulseId}
        />
      )}
      
      {pulseId.length > 0 && pulseId.length < 3 && (
        <p className="text-sm text-amber-400">PulseID must be at least 3 characters</p>
      )}
    </div>
  );
};

export default PulseIdInput;
