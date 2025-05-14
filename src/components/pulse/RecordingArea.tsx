
import React from 'react';
import { Mic, Loader2 } from 'lucide-react';
import RecordingVisualizer from './RecordingVisualizer';
import RecordingTimer from './RecordingTimer';
import RecordingControls from './RecordingControls';
import AudioPlayback from './AudioPlayback';
import TranscriptionDisplay from './TranscriptionDisplay';
import { Button } from '@/components/ui/button';
import { CTAVariant } from './types/speechRecognition';

interface RecordingAreaProps {
  isRecording: boolean;
  recordingTime: number;
  recordingData: Blob | null;
  transcription: string;
  suggestedCTAs: CTAVariant[];
  onStartRecording: () => void;
  onStopRecording: () => void;
  onResetRecording: () => void;
  onSelectCTA?: (cta: CTAVariant) => void;
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
  onSelectCTA
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    if (recordingData && !transcription && suggestedCTAs.length === 0) {
      setIsProcessing(true);
    } else if (transcription || suggestedCTAs.length > 0) {
      setIsProcessing(false);
    }
  }, [recordingData, transcription, suggestedCTAs]);

  const handleCTAClick = (cta: CTAVariant) => {
    if (onSelectCTA) {
      onSelectCTA(cta);
    }
  };

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
            <div className="w-full space-y-4">
              <AudioPlayback 
                audioBlob={recordingData} 
                onReset={onResetRecording} 
              />
              
              {transcription && transcription.length > 0 ? (
                <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-md">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Transcript:</h3>
                  <p className="text-sm text-gray-200">{transcription}</p>
                </div>
              ) : (
                <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-md">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Transcript:</h3>
                  <p className="text-sm text-gray-200 italic">No transcript available or recording was too short</p>
                </div>
              )}
              
              {suggestedCTAs && suggestedCTAs.length > 0 && (
                <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-md">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Suggested Actions:</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestedCTAs.map((cta, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="border-gray-700 hover:bg-gray-800 hover:text-white whitespace-nowrap"
                        onClick={() => handleCTAClick(cta)}
                      >
                        {cta.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
