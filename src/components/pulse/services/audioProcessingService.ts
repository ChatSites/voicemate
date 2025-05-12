
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Process the recorded audio and get AI analysis
export const processAudioRecording = async (
  audioBlob: Blob,
  existingTranscript?: string
): Promise<{
  transcript?: string;
  ctas?: string[];
}> => {
  try {
    console.log("Processing audio recording, blob size:", audioBlob.size);
    
    // Convert the audio blob to base64
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          // Extract base64 data from the data URL
          const base64Audio = (reader.result as string).split(',')[1];
          console.log("Audio converted to base64, length:", base64Audio?.length || 0);
          
          const { data, error } = await supabase.functions.invoke('voice-analysis', {
            body: {
              audio: base64Audio,
              transcript: existingTranscript || undefined // Send existing transcript if available
            }
          });
          
          if (error) {
            console.error("Edge function error:", error);
            reject(error);
            return;
          }
          
          console.log("Voice analysis response:", data);
          
          if (data.success) {
            const result: { transcript?: string; ctas?: string[] } = {};
            
            // If we received a transcript from the API, use it
            if (data.transcript) {
              result.transcript = data.transcript;
              console.log("Received transcript:", data.transcript);
            }
            
            // Process CTAs if available from the API
            if (data.ctas && Array.isArray(data.ctas) && data.ctas.length > 0) {
              result.ctas = data.ctas
                .filter((cta: string) => cta && cta.trim().length > 0)
                .map((cta: string) => {
                  // Make labels concise and action-oriented
                  return cta.trim();
                });
              
              console.log("Processed CTAs:", result.ctas);
            } else {
              // Ensure we always have some CTAs
              result.ctas = ["Plan Trip", "Boat Invitation", "Check Calendar", "Confirm Details"];
              console.log("Using default CTAs due to missing CTAs from API");
            }
            
            resolve(result);
          } else {
            console.error("Processing failed:", data);
            // Even if processing fails, return some default CTAs
            resolve({
              transcript: existingTranscript,
              ctas: ["Send Message", "Schedule Meeting", "Follow Up", "Confirm Plans"]
            });
          }
        } catch (err) {
          console.error("Error in processing audio:", err);
          // Return default values on error
          resolve({
            transcript: existingTranscript,
            ctas: ["Send Message", "Schedule Meeting", "Follow Up", "Confirm Plans"]
          });
        }
      };
      
      reader.onerror = () => {
        console.error("Error reading audio file");
        // Return default values on error
        resolve({
          transcript: existingTranscript,
          ctas: ["Send Message", "Schedule Meeting", "Follow Up", "Confirm Plans"]
        });
      };
      
      reader.readAsDataURL(audioBlob);
    });
  } catch (err) {
    console.error("Error processing audio:", err);
    // Return default values on error
    return {
      transcript: existingTranscript,
      ctas: ["Send Message", "Schedule Meeting", "Follow Up", "Confirm Plans"]
    };
  }
};
