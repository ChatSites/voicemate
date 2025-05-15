
import React from 'react';

interface TranscriptDisplayProps {
  transcript: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-400">Transcript:</h3>
      <div className="bg-gray-900/50 p-4 rounded-md text-gray-200">
        {transcript}
      </div>
    </div>
  );
};
