
import React from 'react';
import { Button } from '@/components/ui/button';

type PulseIdSuggestionsProps = {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

const PulseIdSuggestions: React.FC<PulseIdSuggestionsProps> = ({ suggestions, onSelectSuggestion }) => {
  return (
    <div>
      <p className="text-sm text-amber-400 mb-1">This PulseID is already taken. Try one of these:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            type="button"
            size="sm"
            variant="outline"
            className="text-xs border-voicemate-purple text-voicemate-purple hover:bg-voicemate-purple/20"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PulseIdSuggestions;
