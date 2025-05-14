
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Pause } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
}) => {
  return (
    <div className="space-y-4">
      {isRecording ? (
        <Button
          className="bg-voicemate-red hover:bg-red-600 text-white hover:text-white"
          onClick={onStopRecording}
        >
          <Pause className="mr-2 h-4 w-4" /> Stop Recording
        </Button>
      ) : (
        <div>
          <Button
            className="bg-voicemate-red hover:bg-red-600 text-white hover:text-white"
            onClick={onStartRecording}
          >
            <Mic className="mr-2 h-4 w-4" /> Start Recording
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
