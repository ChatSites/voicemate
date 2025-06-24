
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
  const [pulseData, setPulseData] = useState<any>(null);
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
      return null;
    }
    
    if (!pulseTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please add a title for your pulse.",
        variant: "destructive"
      });
      return null;
    }

    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "User ID not found. Please sign in again.",
        variant: "destructive"
      });
      return null;
    }
    
    // Show sending state
    setIsSending(true);
    setPulseData(null);
    
    try {
      console.log("Sending pulse...");
      
      // Get user's pulse_id from the users table using the security function
      const { data: userPulseId, error: pulseIdError } = await supabase
        .rpc('get_current_user_pulse_id');
      
      if (pulseIdError) {
        console.error("Error fetching user pulse_id:", pulseIdError);
        throw new Error(`Failed to get user pulse_id: ${pulseIdError.message}`);
      }
      
      if (!userPulseId) {
        throw new Error("User pulse_id not found. Please complete your profile setup.");
      }
      
      // Upload the audio file to Supabase Storage
      const audioFileName = `${userId}-${Date.now()}.webm`;
      
      // Create the pulses bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      console.log("Available buckets:", buckets?.map(b => b.name));
      
      const pulsesBucketExists = buckets?.some(bucket => bucket.name === 'pulses');
      if (!pulsesBucketExists) {
        console.log("Creating pulses bucket...");
        const { error: bucketError } = await supabase.storage.createBucket('pulses', {
          public: true,
          allowedMimeTypes: ['audio/webm', 'audio/wav', 'audio/mp3']
        });
        
        if (bucketError) {
          console.error("Error creating bucket:", bucketError);
          throw new Error(`Failed to create storage bucket: ${bucketError.message}`);
        }
      }
      
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
      
      // Convert CTAVariant[] to a JSON-compatible format
      const ctasForDb = JSON.parse(JSON.stringify(suggestedCTAs));

      // Insert the record into the pulses table with proper validation
      const { data: pulseInsertData, error: insertError } = await supabase
        .from('pulses')
        .insert({
          audio_url: audioUrl,
          transcript: transcription || "No transcript available",
          pulse_id: userPulseId,
          intent: pulseTitle || "Untitled Pulse",
          ctas: ctasForDb,
          status: 'inbox'
        })
        .select();

      if (insertError) {
        console.error("Database insertion error:", insertError);
        throw new Error(`Error inserting pulse record: ${insertError.message}`);
      }
      
      console.log("Pulse data saved successfully:", pulseInsertData);
      
      // Store the pulse data in state
      setPulseData(pulseInsertData[0]);
      
      // Success toast notification
      toast({
        title: "Pulse Sent!",
        description: "Your voice message has been sent successfully.",
      });
      
      return pulseInsertData[0];
    } catch (error) {
      console.error("Error sending pulse:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSending(false);
    }
  };

  return { isSending, pulseData, setPulseData, sendPulse };
}
