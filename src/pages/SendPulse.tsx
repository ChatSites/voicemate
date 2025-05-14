import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import PulseForm from '@/components/pulse/PulseForm';
import PulseTips from '@/components/pulse/PulseTips';
import { useRecording } from '@/components/pulse/hooks/useRecording';
import { supabase } from '@/integrations/supabase/client';
import { CTAVariant } from '@/components/pulse/types/speechRecognition';

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

    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "User ID not found. Please sign in again.",
        variant: "destructive"
      });
      return;
    }
    
    // Show sending state
    setIsSending(true);
    
    try {
      console.log("Sending pulse...");
      // Upload the audio file to Supabase Storage
      const audioFileName = `${user.id}-${Date.now()}.webm`;
      
      // Check if the bucket exists and upload to it
      const { data: buckets } = await supabase.storage.listBuckets();
      console.log("Available buckets:", buckets?.map(b => b.name));
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pulses')
        .upload(audioFileName, recordingData, { contentType: 'audio/webm' });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error(`Upload error: ${uploadError.message}`);
      }

      // Get the public URL of the uploaded audio
      const { data: publicUrlData } = supabase.storage
        .from('pulses')
        .getPublicUrl(audioFileName);

      const audioUrl = publicUrlData.publicUrl;
      console.log("Audio uploaded successfully:", audioUrl);

      // Get user's pulse_id from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('pulse_id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (userError) {
        console.error("Error fetching user pulse_id:", userError);
      }
      
      const userPulseId = userData?.pulse_id || user.email?.split('@')[0] || 'anonymous';
      
      // Convert CTAVariant[] to a JSON-compatible format
      // This fixes the type error with Supabase's Json type
      const ctasForDb = JSON.parse(JSON.stringify(suggestedCTAs));

      // Insert the record into the pulses table
      const { data: pulseData, error: insertError } = await supabase
        .from('pulses')
        .insert({
          audio_url: audioUrl,
          transcript: transcription || "No transcript available",
          title: pulseTitle,
          description: pulseDescription,
          pulse_id: userPulseId,
          ctas: ctasForDb // Now this should be compatible with Json type
        })
        .select();

      if (insertError) {
        console.error("Database insertion error:", insertError);
        throw new Error(`Error inserting pulse record: ${insertError.message}`);
      }
      
      console.log("Pulse data saved successfully:", pulseData);
      
      toast({
        title: "Pulse Sent!",
        description: "Your voice message has been sent successfully.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Error sending pulse:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
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
};
