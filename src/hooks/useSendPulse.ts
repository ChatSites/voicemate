
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CTAVariant } from '@/components/pulse/types/speechRecognition';

interface UseSendPulseProps {
  userId: string | undefined;
}

export function useSendPulse({ userId }: UseSendPulseProps) {
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const sendPulse = async (
    recordingData: Blob | null,
    pulseTitle: string,
    pulseDescription: string,
    transcription: string | null,
    suggestedCTAs: CTAVariant[]
  ) => {
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

    if (!userId) {
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
      const audioFileName = `${userId}-${Date.now()}.webm`;
      
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
        .eq('id', userId)
        .maybeSingle();
      
      if (userError) {
        console.error("Error fetching user pulse_id:", userError);
      }
      
      const userPulseId = userData?.pulse_id || 'anonymous';
      
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
          ctas: ctasForDb
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

  return { isSending, sendPulse };
}
