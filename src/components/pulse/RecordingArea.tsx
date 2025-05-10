
import React from 'react';
import { Mic } from 'lucide-react';
import RecordingVisualizer from './RecordingVisualizer';
import RecordingTimer from './RecordingTimer';
import RecordingControls from './RecordingControls';
import AudioPlayback from './AudioPlayback';

interface RecordingAreaProps {
  isRecording: boolean;
  recordingTime: number;
  recordingData: Blob | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onResetRecording: () => void;
}

const RecordingArea: React.FC<RecordingAreaProps> = ({
  isRecording,
  recordingTime,
  recordingData,
  onStartRecording,
  onStopRecording,
  onResetRecording,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-700 rounded-lg bg-black/30">
      {recordingData ? (
        <AudioPlayback 
          audioBlob={recordingData} 
          onReset={onResetRecording} 
        />
      ) : (
        <div className="text-center space-y-4">
          {isRecording ? (
            <div className="space-y-4">
              <RecordingVisualizer />
              <RecordingTimer seconds={recordingTime} />
              <RecordingControls
                isRecording={true}
                onStartRecording={onStartRecording}
                onStopRecording={onStopRecording}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-8 rounded-full bg-voicemate-red/10 mb-4 inline-flex">
                <Mic className="h-12 w-12 text-voicemate-red" />
              </div>
              <RecordingControls
                isRecording={false}
                onStartRecording={onStartRecording}
                onStopRecording={onStopRecording}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordingArea;
