
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Interface for audio processing results
interface AudioProcessingResult {
  transcript?: string;
  intent?: string;
  description?: string;
  ctas?: string[];
}

// Process the recorded audio and get AI analysis
export const processAudioRecording = async (
  audioBlob: Blob,
  existingTranscript?: string
): Promise<AudioProcessingResult> => {
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
            const result: AudioProcessingResult = {};
            
            // If we received a transcript from the API, use it
            if (data.transcript) {
              result.transcript = data.transcript;
              console.log("Received transcript:", data.transcript);
            }
            
            // Store intent information if available
            if (data.intent) {
              result.intent = data.intent;
              result.description = data.description || '';
              console.log("Identified intent:", data.intent, "Description:", data.description || 'None');
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
              // Generate default CTAs based on intent if available
              result.ctas = getDefaultCTAs(data.intent || 'default');
              console.log("Using default CTAs for intent:", data.intent || 'default');
            }
            
            resolve(result);
          } else {
            console.error("Processing failed:", data);
            // Return some default data on error
            resolve({
              transcript: existingTranscript,
              intent: data.intent || 'default',
              description: data.description || 'Error processing',
              ctas: data.ctas || getDefaultCTAs('default')
            });
          }
        } catch (err) {
          console.error("Error in processing audio:", err);
          // Return default values on error
          resolve({
            transcript: existingTranscript,
            intent: 'default',
            description: 'Error processing',
            ctas: getDefaultCTAs('default')
          });
        }
      };
      
      reader.onerror = () => {
        console.error("Error reading audio file");
        // Return default values on error
        resolve({
          transcript: existingTranscript,
          intent: 'default',
          description: 'Error reading file',
          ctas: getDefaultCTAs('default')
        });
      };
      
      reader.readAsDataURL(audioBlob);
    });
  } catch (err) {
    console.error("Error processing audio:", err);
    // Return default values on error
    return {
      transcript: existingTranscript,
      intent: 'default',
      description: 'Error in processing',
      ctas: getDefaultCTAs('default')
    };
  }
};

// Get default CTAs based on intent
const getDefaultCTAs = (intent: string): string[] => {
  const defaultCTAs: Record<string, string[]> = {
    'travel_invitation': ["Plan Trip", "Check Calendar", "Book Travel", "Confirm Dates"],
    'scheduling': ["Schedule Meeting", "Check Calendar", "Confirm Dates", "Set Reminder"],
    'follow_up': ["Remind Later", "Send Follow-up", "Check Calendar", "Make Note"],
    'invitation': ["Accept Invitation", "Check Calendar", "Request Details", "Share Plan"],
    'boat_related': ["Boat Invitation", "Plan Trip", "Check Availability", "Weather Check"],
    'social_gathering': ["RSVP Now", "Check Calendar", "Suggest Time", "Ask Details"],
    'default': ["Send Message", "Schedule Meeting", "Follow Up", "Confirm Plans"]
  };
  
  return defaultCTAs[intent] || defaultCTAs.default;
};
