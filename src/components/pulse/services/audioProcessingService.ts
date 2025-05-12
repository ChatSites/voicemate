
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
            
            // Process CTAs 
            if (data.ctas && Array.isArray(data.ctas)) {
              result.ctas = data.ctas
                .filter((cta: string) => cta && cta.trim().length > 0)
                .map((cta: string) => {
                  // Make labels concise and action-oriented
                  return cta.trim();
                });
              
              console.log("Processed CTAs:", result.ctas);
            }
            
            resolve(result);
          } else {
            console.error("Processing failed:", data);
            reject(new Error("Processing failed"));
          }
        } catch (err) {
          console.error("Error in processing audio:", err);
          reject(err);
        }
      };
      
      reader.onerror = () => {
        console.error("Error reading audio file");
        reject(new Error("Error reading audio file"));
      };
      
      reader.readAsDataURL(audioBlob);
    });
  } catch (err) {
    console.error("Error processing audio:", err);
    throw err;
  }
};
