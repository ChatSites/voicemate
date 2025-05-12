
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import PulseForm from '@/components/pulse/PulseForm';
import PulseTips from '@/components/pulse/PulseTips';
import { useRecording } from '@/components/pulse/useRecording';

export default function SendPulse() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [pulseTitle, setPulseTitle] = useState('');
  const [pulseDescription, setPulseDescription] = useState('');
  const [isSending, setIsSending] = useState(false);
  
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
  
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, user, navigate]);
  
  const handleSendPulse = async () => {
    if (!recordingData) {
      toast({
        title: "No Recording",
        description: "Please record a voice message before sending.",
        variant: "destructive"
      });
      return;
    }
    
    if (!pulseTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please add a title for your pulse.",
        variant: "destructive"
      });
      return;
    }
    
    // Show sending state
    setIsSending(true);
    
    // This is where you would upload the recording to the server
    // For now, we'll just show a success message after a delay
    setTimeout(() => {
      toast({
        title: "Pulse Sent!",
        description: "Your voice message has been sent successfully.",
      });
      setIsSending(false);
      navigate('/dashboard');
    }, 2000);
  };
  
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Create a New Pulse</h1>
          
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
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
                onResetRecording={resetRecording}
                onTitleChange={setPulseTitle}
                onDescriptionChange={setPulseDescription}
                onSendPulse={handleSendPulse}
              />
            </div>
            
            <div>
              <PulseTips />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
