
import React from 'react';
import FormFeedback from '@/components/ui/form-feedback';
import PulseIdSuggestions from './PulseIdSuggestions';

interface FeedbackMessagesProps {
  pulseId: string;
  touched: boolean;
  isAvailable: boolean | null;
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

const FeedbackMessages: React.FC<FeedbackMessagesProps> = ({
  pulseId,
  touched,
  isAvailable,
  suggestions,
  onSelectSuggestion
}) => {
  // Don't render anything if pulseId hasn't been touched or is empty
  if (!touched || !pulseId) {
    return null;
  }

  return (
    <>
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
            onSelectSuggestion={onSelectSuggestion} 
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
    </>
  );
};

export default FeedbackMessages;
