
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Play, Pause } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AudioPlaybackProps {
  audioBlob: Blob;
  onReset: () => void;
}

const AudioPlayback: React.FC<AudioPlaybackProps> = ({ audioBlob, onReset }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioLoaded, setAudioLoaded] = useState(false);
  
  useEffect(() => {
    // Create a new object URL for the audio blob
    try {
      if (!audioBlob || audioBlob.size === 0) {
        console.error("Invalid audio blob:", audioBlob);
        toast({
          title: "Audio Error",
          description: "Invalid audio recording data",
          variant: "destructive"
        });
        return;
      }
      
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      console.log("Audio URL created:", url, "Blob size:", audioBlob.size, "Blob type:", audioBlob.type);
      
      // Clean up the URL when component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      console.error('Error creating audio URL:', err);
      toast({
        title: "Audio Error",
        description: "Could not create audio URL for playback",
        variant: "destructive"
      });
    }
  }, [audioBlob]);
  
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("Audio playback started successfully");
          setIsPlaying(true);
        }).catch(err => {
          console.error('Error playing audio:', err);
          toast({
            title: "Playback Error",
            description: "Could not play the audio. The recording may be too short or empty.",
            variant: "destructive"
          });
        });
      }
    }
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleLoadedData = () => {
    console.log("Audio loaded successfully");
    setAudioLoaded(true);
  };
  
  return (
    <div className="w-full space-y-4">
      <audio 
        ref={audioRef}
        src={audioUrl}
        onEnded={handleAudioEnded}
        onLoadedData={handleLoadedData}
        onError={(e) => {
          console.error('Audio error:', e);
          toast({
            title: "Audio Error",
            description: "Could not load audio for playback",
            variant: "destructive"
          });
        }}
      />
      
      <div className="flex items-center justify-between bg-gray-900 p-3 rounded-md">
        <Button
          variant="outline"
          size="sm"
          className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
          onClick={handlePlayPause}
          disabled={!audioLoaded}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div className="text-sm text-gray-400">
          {isPlaying ? 'Playing...' : audioLoaded ? 'Recorded message' : 'Loading audio...'}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white hover:text-white"
          onClick={onReset}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AudioPlayback;
