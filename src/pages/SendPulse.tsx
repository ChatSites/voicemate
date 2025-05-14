
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRecording } from '@/components/pulse/hooks/useRecording';
import { useSendPulse } from '@/hooks/useSendPulse';
import PulseLoading from '@/components/pulse/PulseLoading';
import PulseLayout from '@/components/pulse/PulseLayout';
import PulseContent from '@/components/pulse/PulseContent';

export default function SendPulse() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [pulseTitle, setPulseTitle] = useState('');
  const [pulseDescription, setPulseDescription] = useState('');
  
  const {
    isRecording,
    recordingTime,
    recordingData,
    transcription,
    suggestedCTAs,
    startRecording,
    stopRecording,
    resetRecording
  } = useRecording();
  
  const { isSending, sendPulse } = useSendPulse({ userId: user?.id });
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    // Auto-populate title with first suggested CTA if available
    if (suggestedCTAs.length > 0 && !pulseTitle && suggestedCTAs[0].label) {
      console.log("Auto-setting title to:", suggestedCTAs[0].label);
      // Remove emoji if present
      setPulseTitle(suggestedCTAs[0].label.replace(/^[^\w]+/, '').trim());
    }
  }, [suggestedCTAs, pulseTitle]);
  
  const handleSendPulse = () => {
    sendPulse(
      recordingData, 
      pulseTitle, 
      pulseDescription, 
      transcription, 
      suggestedCTAs
    );
  };
  
  if (loading) {
    return <PulseLoading />;
  }
  
  return (
    <PulseLayout title="Create a New Pulse">
      <PulseContent
        isRecording={isRecording}
        recordingTime={recordingTime}
        recordingData={recordingData}
        transcription={transcription}
        suggestedCTAs={suggestedCTAs}
        pulseTitle={pulseTitle}
        pulseDescription={pulseDescription}
        isSending={isSending}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onResetRecording={resetRecording}
        onTitleChange={setPulseTitle}
        onDescriptionChange={setPulseDescription}
        onSendPulse={handleSendPulse}
      />
    </PulseLayout>
  );
};
