
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { User, Clock, Mail, Play, Pause, Archive } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface PulseItemProps {
  pulse: {
    id: string;
    sender: string;
    title: string;
    timestamp: string;
    unread?: boolean;
    duration: string;
    audio_url?: string;
  };
  onPlay: (id: string) => void;
  onToggleSelect: (id: string) => void;
  isSelected: boolean;
}

const PulseItem: React.FC<PulseItemProps> = ({ pulse, onPlay, onToggleSelect, isSelected }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  const handlePlayToggle = () => {
    if (!pulse.audio_url) return;
    
    if (isPlaying && audioElement) {
      audioElement.pause();
      setIsPlaying(false);
      return;
    }
    
    if (!audioElement) {
      const audio = new Audio(pulse.audio_url);
      audio.addEventListener('ended', () => setIsPlaying(false));
      setAudioElement(audio);
      
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    } else {
      audioElement.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    }
    
    setIsPlaying(true);
    onPlay(pulse.id);
  };
  
  // Cleanup effect
  React.useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.remove();
      }
    };
  }, [audioElement]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className={`flex items-center p-4 rounded-lg mb-3 ${
          isSelected 
            ? 'bg-voicemate-purple/20 border border-voicemate-purple'
            : pulse.unread 
              ? 'bg-voicemate-purple/10 border border-voicemate-purple/20' 
              : 'bg-gray-900/50 border border-gray-800'
        }`}
      >
        <div className="flex-shrink-0 mr-4">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(pulse.id)}
            className="mt-1 data-[state=checked]:bg-voicemate-purple data-[state=checked]:border-voicemate-purple"
          />
        </div>
        <div className="flex-shrink-0 mr-4">
          <div className="w-10 h-10 rounded-full bg-voicemate-card flex items-center justify-center border border-gray-700">
            <User className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">{pulse.title}</h4>
              <p className="text-xs text-gray-400">From: {pulse.sender}</p>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>{pulse.timestamp}</span>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <div className="flex items-center text-xs text-gray-400 mr-3">
              <Mail className="h-3 w-3 mr-1" />
              <span>{pulse.duration}</span>
            </div>
            <div className="flex-grow"></div>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 border-gray-700 hover:bg-voicemate-purple hover:text-white hover:border-transparent"
              onClick={handlePlayToggle}
              disabled={!pulse.audio_url}
            >
              {isPlaying ? (
                <><Pause className="h-3 w-3 mr-1" /> Pause</>
              ) : (
                <><Play className="h-3 w-3 mr-1" /> Play</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PulseItem;
