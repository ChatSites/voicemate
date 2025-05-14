
import React, { useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import RecordingArea from './RecordingArea';
import FormHeader from './FormHeader';
import FormFields from './FormFields';
import SendButton from './SendButton';
import { CTAVariant } from './types/speechRecognition';

interface PulseFormProps {
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
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSendPulse: () => void;
  onSelectCTA?: (cta: CTAVariant) => void;
}

const PulseForm: React.FC<PulseFormProps> = ({
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
  onSendPulse,
  onSelectCTA
}) => {
  // Automatically scroll to CTA section when suggestions appear
  const ctaSectionRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (suggestedCTAs.length > 0 && ctaSectionRef.current) {
      ctaSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [suggestedCTAs]);

  // Handle CTA selection for title
  const handleCTAClick = (cta: CTAVariant) => {
    // Use the CTA label for the title if title is empty
    if (!pulseTitle.trim()) {
      onTitleChange(cta.label.replace(/^[^\w]+/, '').trim()); // Remove leading emoji if present
    }
    
    // Call the parent's onSelectCTA if provided
    if (onSelectCTA) {
      onSelectCTA(cta);
    }
  };

  return (
    <Card className="bg-voicemate-card border-gray-800">
      <FormHeader />
      
      <CardContent>
        <div className="space-y-4">
          <FormFields
            pulseTitle={pulseTitle}
            pulseDescription={pulseDescription}
            onTitleChange={onTitleChange}
            onDescriptionChange={onDescriptionChange}
          />
          
          <RecordingArea
            isRecording={isRecording}
            recordingTime={recordingTime}
            recordingData={recordingData}
            transcription={transcription}
            suggestedCTAs={suggestedCTAs}
            onStartRecording={onStartRecording}
            onStopRecording={onStopRecording}
            onResetRecording={onResetRecording}
            onSelectCTA={handleCTAClick}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <SendButton 
          disabled={!recordingData || isSending || !pulseTitle.trim()}
          isSending={isSending}
          onSendPulse={onSendPulse}
        />
      </CardFooter>
    </Card>
  );
};

export default PulseForm;
