
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface AudioPlaybackProps {
  audioBlob: Blob;
  onReset: () => void;
}

const AudioPlayback: React.FC<AudioPlaybackProps> = ({ audioBlob, onReset }) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-center">
        <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
      </div>
      <div className="flex justify-center space-x-3">
        <Button
          variant="outline"
          className="border-gray-700"
          onClick={onReset}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Discard
        </Button>
      </div>
    </div>
  );
};

export default AudioPlayback;
