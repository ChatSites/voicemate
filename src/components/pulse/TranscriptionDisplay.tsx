
import React, { useEffect, useRef } from 'react';

interface TranscriptionDisplayProps {
  transcription: string;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ transcription }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-scroll to bottom when transcription updates
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcription]);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full p-3 bg-black/50 border border-gray-800 rounded-md text-left max-h-40 overflow-y-auto"
    >
      <p className="text-sm text-gray-200">
        <span className="text-xs font-medium text-gray-400 block mb-1">Live Transcription:</span>
        {transcription && transcription.length > 0 ? transcription : "Waiting for speech..."}
      </p>
    </div>
  );
};

export default TranscriptionDisplay;
