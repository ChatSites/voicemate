
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AudioPlayerProps {
  audioUrl: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.addEventListener('ended', () => setIsPlaying(false));
      setAudioElement(audio);
    }

    return () => {
      // Cleanup audio element
      if (audioElement) {
        audioElement.pause();
        audioElement.removeEventListener('ended', () => setIsPlaying(false));
      }
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play().catch(err => {
        console.error('Error playing audio:', err);
        toast({
          title: "Playback Error",
          description: "Could not play this audio message.",
          variant: "destructive"
        });
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="rounded-lg bg-gray-900 p-4 flex items-center gap-4">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={togglePlayback}
        className="h-12 w-12 rounded-full border-voicemate-purple hover:bg-voicemate-purple/20"
      >
        {isPlaying ? (
          <PauseCircle className="h-8 w-8 text-voicemate-purple" />
        ) : (
          <PlayCircle className="h-8 w-8 text-voicemate-purple" />
        )}
      </Button>
      <div className="flex-1">
        <div className="text-sm text-gray-400">
          {isPlaying ? 'Playing voice message...' : 'Voice message'}
        </div>
        <div className="h-1 bg-gray-700 rounded-full mt-2">
          <div className={`h-full bg-voicemate-purple rounded-full ${isPlaying ? 'animate-pulse' : ''}`} style={{ width: isPlaying ? '30%' : '0%' }}></div>
        </div>
      </div>
    </div>
  );
};
