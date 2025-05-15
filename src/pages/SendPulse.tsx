
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRecording } from '@/components/pulse/hooks/useRecording';
import { useSendPulse } from '@/hooks/useSendPulse';
import PulseLoading from '@/components/pulse/PulseLoading';
import PulseLayout from '@/components/pulse/PulseLayout';
import PulseContent from '@/components/pulse/PulseContent';
import PulseSuccess from '@/components/pulse/PulseSuccess';

export default function SendPulse() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [pulseTitle, setPulseTitle] = useState('');
  const [pulseDescription, setPulseDescription] = useState('');
  const [pulseUrl, setPulseUrl] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
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
  
  const { isSending, pulseData, setPulseData, sendPulse } = useSendPulse({ userId: user?.id });
  
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

  useEffect(() => {
    // Show success state when pulse data is available
    if (pulseData) {
      // Create shareable URL based on pulse ID
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/pulse/${pulseData.id}`;
      setPulseUrl(shareUrl);
      setShowSuccess(true);
    }
  }, [pulseData]);
  
  const handleSendPulse = async () => {
    const result = await sendPulse(
      recordingData, 
      pulseTitle, 
      pulseDescription, 
      transcription, 
      suggestedCTAs
    );
    
    if (result) {
      // Success handling is done in the useEffect
    }
  };

  const handleReset = () => {
    setPulseData(null);
    setShowSuccess(false);
    resetRecording();
    setPulseTitle('');
    setPulseDescription('');
  };

  const handleDone = () => {
    navigate('/dashboard');
  };
  
  if (loading) {
    return <PulseLoading />;
  }
  
  return (
    <PulseLayout title="Create a New Pulse">
      {showSuccess ? (
        <PulseSuccess 
          pulseUrl={pulseUrl}
          pulseTitle={pulseTitle}
          onReset={handleReset}
          onDone={handleDone}
        />
      ) : (
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
      )}
    </PulseLayout>
  );
};
