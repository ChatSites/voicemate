
import React from 'react';
import PulseForm from '@/components/pulse/PulseForm';
import PulseTips from '@/components/pulse/PulseTips';
import { CTAVariant } from '@/components/pulse/types/speechRecognition';

interface PulseContentProps {
  isRecording: boolean;
  recordingTime: number;
  recordingData: Blob | null;
  transcription: string;
  suggestedCTAs: CTAVariant[];
  pulseTitle: string;
  pulseDescription: string;
  isSending: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onResetRecording: () => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onSendPulse: () => void;
}

const PulseContent: React.FC<PulseContentProps> = ({
  isRecording,
  recordingTime,
  recordingData,
  transcription,
  suggestedCTAs,
  pulseTitle,
  pulseDescription,
  isSending,
  onStartRecording,
  onStopRecording,
  onResetRecording,
  onTitleChange,
  onDescriptionChange,
  onSendPulse
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <PulseForm
          isRecording={isRecording}
          recordingTime={recordingTime}
          recordingData={recordingData}
          transcription={transcription}
          suggestedCTAs={suggestedCTAs}
          pulseTitle={pulseTitle}
          pulseDescription={pulseDescription}
          isSending={isSending}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          onResetRecording={onResetRecording}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          onSendPulse={onSendPulse}
        />
      </div>
      
      <div>
        <PulseTips />
      </div>
    </div>
  );
};

export default PulseContent;
