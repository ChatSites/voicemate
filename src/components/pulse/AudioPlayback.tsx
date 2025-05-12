
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Play, Pause } from 'lucide-react';

interface AudioPlaybackProps {
  audioBlob: Blob;
  onReset: () => void;
}

const AudioPlayback: React.FC<AudioPlaybackProps> = ({ audioBlob, onReset }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  
  useEffect(() => {
    // Create a new object URL for the audio blob
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);
    
    // Clean up the URL when component unmounts
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioBlob]);
  
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  return (
    <div className="w-full space-y-4">
      <audio 
        ref={audioRef}
        src={audioUrl}
        onEnded={handleAudioEnded}
        onError={(e) => console.error('Audio error:', e)}
        className="hidden"
      />
      
      <div className="flex items-center justify-between bg-gray-900 p-3 rounded-md">
        <Button
          variant="outline"
          size="sm"
          className="border-gray-700 hover:bg-gray-800"
          onClick={handlePlayPause}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div className="text-sm text-gray-400">
          {isPlaying ? 'Playing...' : 'Recorded message'}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="border-gray-700 hover:bg-gray-800"
          onClick={onReset}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AudioPlayback;
