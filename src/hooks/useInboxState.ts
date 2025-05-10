
import { useState } from 'react';

export const useInboxState = () => {
  const [selectedPulseId, setSelectedPulseId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlayPulse = (id: string) => {
    setSelectedPulseId(id);
    setIsPlaying(true);
    // In a real app, this would play the audio
    
    // For demo purposes, we'll just toggle the play state after 3 seconds
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };
  
  return {
    selectedPulseId,
    isPlaying,
    handlePlayPulse,
  };
};
