
import React from 'react';
import { Mic, Loader2 } from 'lucide-react';
import RecordingVisualizer from './RecordingVisualizer';
import RecordingTimer from './RecordingTimer';
import RecordingControls from './RecordingControls';
import AudioPlayback from './AudioPlayback';
import TranscriptionDisplay from './TranscriptionDisplay';

interface RecordingAreaProps {
  isRecording: boolean;
  recordingTime: number;
  recordingData: Blob | null;
  transcription: string;
  suggestedCTAs: string[];
  onStartRecording: () => void;
  onStopRecording: () => void;
  onResetRecording: () => void;
}

const RecordingArea: React.FC<RecordingAreaProps> = ({
  isRecording,
  recordingTime,
  recordingData,
  transcription,
  suggestedCTAs,
  onStartRecording,
  onStopRecording,
  onResetRecording,
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    if (recordingData && !transcription) {
      setIsProcessing(true);
    } else if (transcription) {
      setIsProcessing(false);
    }
  }, [recordingData, transcription]);

  return (
    <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-700 rounded-lg bg-black/30">
      {recordingData ? (
        <>
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-4 py-8">
              <Loader2 className="h-8 w-8 text-voicemate-purple animate-spin" />
              <p className="text-gray-400">Processing your recording with AI...</p>
            </div>
          ) : (
            <AudioPlayback 
              audioBlob={recordingData} 
              onReset={onResetRecording} 
            />
          )}
        </>
      ) : (
        <div className="text-center space-y-4 w-full">
          {isRecording ? (
            <div className="space-y-4">
              <RecordingVisualizer />
              <RecordingTimer seconds={recordingTime} />
              {transcription && (
                <TranscriptionDisplay transcription={transcription} />
              )}
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
