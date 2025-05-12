
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Interface for CTA variant
interface CTAVariant {
  label: string;
  action: string;
  url?: string;
}

// Interface for audio processing results
interface AudioProcessingResult {
  transcript?: string;
  intent?: string;
  description?: string;
  category?: string;
  ctas?: CTAVariant[];
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
              result.category = data.category || '';
              console.log("Identified intent:", data.intent, "Description:", data.description || 'None');
            }
            
            // Process CTAs if available from the API
            if (data.ctas && Array.isArray(data.ctas) && data.ctas.length > 0) {
              // Format CTAs in the expected structure
              result.ctas = data.ctas.map((cta: any) => {
                if (typeof cta === 'object' && cta.label) {
                  // If CTA is already in structured format
                  return {
                    label: cta.label,
                    action: cta.action || 'default_action',
                    url: cta.url || undefined
                  };
                } else if (typeof cta === 'string') {
                  // If CTA is a simple string, convert to structured format
                  return {
                    label: cta.trim(),
                    action: mapLabelToAction(cta.trim()),
                    url: undefined
                  };
                }
                return null;
              }).filter(Boolean);
              
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

// Map a CTA label to an action type
const mapLabelToAction = (label: string): string => {
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes('schedule') || lowerLabel.includes('book')) return 'open_scheduling_link';
  if (lowerLabel.includes('reschedule')) return 'open_reschedule';
  if (lowerLabel.includes('call')) return 'schedule_callback';
  if (lowerLabel.includes('save')) return 'vault_message';
  if (lowerLabel.includes('remind')) return 'set_reminder';
  if (lowerLabel.includes('follow')) return 'schedule_followup';
  if (lowerLabel.includes('ask') || lowerLabel.includes('question')) return 'open_reply_input';
  if (lowerLabel.includes('reply')) return 'send_reply';
  if (lowerLabel.includes('feedback')) return 'open_feedback_form';
  if (lowerLabel.includes('share')) return 'share_packet';
  if (lowerLabel.includes('learn') || lowerLabel.includes('more info')) return 'open_more_info';
  if (lowerLabel.includes('price') || lowerLabel.includes('quote')) return 'show_pricing';
  
  // Default action
  return 'default_action';
};

// Get default CTAs based on intent
const getDefaultCTAs = (intent: string): CTAVariant[] => {
  const defaultCTAsByIntent: Record<string, CTAVariant[]> = {
    'travel_invitation': [
      { label: "🗓 Schedule Trip", action: "open_scheduling_link" },
      { label: "📅 Check Calendar", action: "open_calendar" },
      { label: "📝 Confirm Details", action: "open_reply_input" }
    ],
    'scheduling': [
      { label: "📅 Schedule Now", action: "open_scheduling_link" },
      { label: "🔄 Reschedule", action: "open_reschedule" },
      { label: "📝 Ask Question", action: "open_reply_input" }
    ],
    'follow_up': [
      { label: "🔔 Remind Me Later", action: "set_reminder" },
      { label: "📤 Send Follow-up", action: "send_reply" },
      { label: "📝 Make Note", action: "vault_message" }
    ],
    'invitation': [
      { label: "✓ Accept Invitation", action: "confirm_rsvp" },
      { label: "📅 Check Calendar", action: "open_calendar" },
      { label: "📝 Ask Details", action: "open_reply_input" }
    ],
    'boat_related': [
      { label: "🚤 Plan Trip", action: "open_scheduling_link" },
      { label: "🔍 Check Availability", action: "open_calendar" },
      { label: "🌤️ Weather Check", action: "open_more_info" }
    ],
    'social_gathering': [
      { label: "📅 RSVP Now", action: "confirm_rsvp" },
      { label: "⏰ Suggest Time", action: "open_scheduling_link" },
      { label: "📝 Ask Details", action: "open_reply_input" }
    ],
    'default': [
      { label: "📤 Send Message", action: "send_reply" },
      { label: "📅 Schedule Meeting", action: "open_scheduling_link" },
      { label: "👍 Confirm Plans", action: "confirm_rsvp" }
    ]
  };
  
  return defaultCTAsByIntent[intent] || defaultCTAsByIntent.default;
};
