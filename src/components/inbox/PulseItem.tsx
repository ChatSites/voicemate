
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { User, Clock, Mail, Play, Archive } from 'lucide-react';

interface PulseItemProps {
  pulse: {
    id: string;
    sender: string;
    title: string;
    timestamp: string;
    unread?: boolean;
    duration: string;
  };
  onPlay: (id: string) => void;
}

const PulseItem: React.FC<PulseItemProps> = ({ pulse, onPlay }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex items-center p-4 rounded-lg mb-3 ${pulse.unread ? 'bg-voicemate-purple/10 border border-voicemate-purple/20' : 'bg-gray-900/50 border border-gray-800'}`}>
        <div className="flex-shrink-0 mr-4">
          <div className="w-10 h-10 rounded-full bg-voicemate-card flex items-center justify-center border border-gray-700">
            <User className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">{pulse.title}</h4>
              <p className="text-xs text-gray-400">{pulse.sender}</p>
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
              onClick={() => onPlay(pulse.id)}
            >
              <Play className="h-3 w-3 mr-1" /> Play
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 text-gray-400 hover:text-white ml-1"
            >
              <Archive className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PulseItem;
