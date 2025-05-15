
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/providers/ThemeProvider';
import StatusIndicator from './StatusIndicator';
import FeedbackMessages from './FeedbackMessages';
import RefreshButton from './RefreshButton';
import { usePulseIdAvailability } from '@/hooks/usePulseIdAvailability';

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
  const [touched, setTouched] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    isChecking,
    isAvailable,
    suggestions,
    showRefreshButton,
    refreshCheck
  } = usePulseIdAvailability({
    pulseId,
    touched,
    setPulseIdAvailable
  });
  
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
          onBlur={() => {
            setTouched(true);
            if (pulseId && pulseId.length >= 3) {
              refreshCheck();
            }
          }}
          className={`${isDark ? 'bg-black/30 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} pr-10`}
          data-testid="pulse-id-input"
        />
        
        <StatusIndicator 
          isChecking={isChecking} 
          isAvailable={isAvailable} 
          pulseId={pulseId}
          onRefreshCheck={refreshCheck} 
        />
      </div>
      
      <FeedbackMessages
        pulseId={pulseId}
        touched={touched}
        isAvailable={isAvailable}
        suggestions={suggestions}
        onSelectSuggestion={(suggestion) => setPulseId(suggestion)}
      />

      <RefreshButton 
        pulseId={pulseId} 
        isChecking={isChecking} 
        onRefresh={refreshCheck}
        showButton={showRefreshButton}
      />
    </div>
  );
};

export default PulseIdInput;
