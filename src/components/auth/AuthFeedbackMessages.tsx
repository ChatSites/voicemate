
import React from 'react';
import FormFeedback from '@/components/ui/form-feedback';
import PulseIdSuggestions from './PulseIdSuggestions';

interface AuthFeedbackMessagesProps {
  pulseId: string;
  pulseIdTouched: boolean;
  pulseIdAvailable: boolean | null;
  isCheckingPulseId: boolean;
  pulseIdSuggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

const AuthFeedbackMessages: React.FC<AuthFeedbackMessagesProps> = ({
  pulseId,
  pulseIdTouched,
  pulseIdAvailable,
  isCheckingPulseId,
  pulseIdSuggestions,
  onSelectSuggestion
}) => {
  return (
    <>
      {pulseIdTouched && pulseId.length > 0 && pulseId.length < 3 && (
        <FormFeedback
          type="warning"
          message="PulseID must be at least 3 characters"
        />
      )}
      
      {pulseIdTouched && pulseIdAvailable === false && !isCheckingPulseId && pulseId.length >= 3 && (
        <FormFeedback
          type="error"
          message="This PulseID is already taken"
        />
      )}
      
      {pulseIdSuggestions.length > 0 && (
        <PulseIdSuggestions 
          suggestions={pulseIdSuggestions}
          onSelectSuggestion={onSelectSuggestion}
        />
      )}
      
      {pulseIdTouched && pulseIdAvailable === true && !isCheckingPulseId && pulseId.length >= 3 && (
        <FormFeedback
          type="success"
          message="This PulseID is available!"
          data-testid="auth-available-message"
        />
      )}
    </>
  );
};

export default AuthFeedbackMessages;
