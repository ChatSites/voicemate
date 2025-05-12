
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
    console.log("Processing audio recording...");
    
    // Convert the audio blob to base64
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          // Extract base64 data from the data URL
          const base64Audio = (reader.result as string).split(',')[1];
          
          const { data, error } = await supabase.functions.invoke('voice-analysis', {
            body: {
              audio: base64Audio,
              transcript: existingTranscript || undefined // Send existing transcript if available
            }
          });
          
          if (error) {
            console.error("Edge function error:", error);
            toast({
              title: "Processing Error",
              description: "Failed to analyze your voice message. Please try again.",
              variant: "destructive"
            });
            reject(error);
            return;
          }
          
          console.log("Voice analysis response:", data);
          
          if (data.success) {
            const result: { transcript?: string; ctas?: string[] } = {};
            
            // If we received a transcript from the API, use it
            if (data.transcript) {
              result.transcript = data.transcript;
            }
            
            // Process CTAs 
            if (data.ctas && Array.isArray(data.ctas)) {
              const ctaLabels = data.ctas
                .map((cta: { label: string }) => cta.label)
                .filter((label: string) => label && label.trim().length > 0)
                .map((label: string) => {
                  // Make labels shorter and more action-oriented
                  let actionLabel = label.trim();
                  // Remove common prefixes
                  actionLabel = actionLabel.replace(/^(I want to|Let me|I'd like to|Please|Can you|Could you)/i, '').trim();
                  // Capitalize first letter
                  actionLabel = actionLabel.charAt(0).toUpperCase() + actionLabel.slice(1);
                  return actionLabel;
                });
              
              console.log("Suggested CTAs:", ctaLabels);
              result.ctas = ctaLabels;
            }
            
            resolve(result);
          } else {
            reject(new Error("Processing failed"));
          }
        } catch (err) {
          console.error("Error in processing audio:", err);
          reject(err);
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Error reading audio file"));
      };
      
      reader.readAsDataURL(audioBlob);
    });
  } catch (err) {
    console.error("Error processing audio:", err);
    throw err;
  }
};
