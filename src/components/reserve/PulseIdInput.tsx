
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import PulseIdSuggestions from './PulseIdSuggestions';
import FormFeedback from '@/components/ui/form-feedback';
import { useTheme } from '@/components/providers/ThemeProvider';
import { checkPulseIdAvailability } from '@/services/pulseIdService';

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
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRun = useRef(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
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
    
    // Debounce to avoid too many API calls
    checkTimeoutRef.current = setTimeout(async () => {
      try {
        // Use the shared service instead of direct API call
        const result = await checkPulseIdAvailability(pulseId);
        
        setIsAvailable(result.available);
        setPulseIdAvailable(result.available);
        setSuggestions(result.suggestions);
      } catch (error) {
        console.error('Error checking PulseID availability:', error);
        setIsAvailable(null);
        setPulseIdAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, 600);
    
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [pulseId, touched, setPulseIdAvailable]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove spaces and convert to lowercase
    const value = e.target.value.trim().replace(/\s+/g, '').toLowerCase();
    setPulseId(value);
    if (!touched && value) {
      setTouched(true);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          placeholder="Choose your PulseID"
          value={pulseId}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          className={`${isDark ? 'bg-black/30 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} pr-10`}
        />
        {isChecking && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 text-voicemate-purple animate-spin" />
          </div>
        )}
        {!isChecking && isAvailable !== null && pulseId.length >= 3 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
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
        />
      )}
    </div>
  );
};

export default PulseIdInput;
