
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VoiceAnalysisRequest {
  audio?: string;
  transcript?: string;
}

interface VoiceAnalysisResponse {
  success: boolean;
  transcript?: string;
  intent?: string;
  description?: string;
  category?: string;
  ctas?: Array<{
    label: string;
    action: string;
    url?: string;
  }>;
  error?: string;
}

// Intent categories mapping
const intentMap: Record<string, {
  description: string;
  category: string;
  defaultCTAs: Array<{
    label: string;
    action: string;
    url?: string;
  }>;
}> = {
  "booking_request": {
    description: "User wants to book or schedule a time",
    category: "Scheduling",
    defaultCTAs: [
      { label: "📅 Schedule Now", action: "open_scheduling_link" },
      { label: "👍 Confirm Interest", action: "confirm_rsvp" },
      { label: "💬 Ask Question", action: "open_reply_input" }
    ]
  },
  "follow_up": {
    description: "User wants to follow up on a previous conversation",
    category: "Response",
    defaultCTAs: [
      { label: "🔔 Remind Later", action: "set_reminder" },
      { label: "📤 Send Follow-up", action: "send_reply" },
      { label: "📝 Make Note", action: "vault_message" }
    ]
  },
  "information_request": {
    description: "User is asking for more information",
    category: "Information",
    defaultCTAs: [
      { label: "📚 Learn More", action: "open_more_info" },
      { label: "❓ Explain This", action: "open_explanation" },
      { label: "📤 Send Details", action: "send_reply" }
    ]
  },
  "social_invitation": {
    description: "User is extending a social invitation",
    category: "Scheduling",
    defaultCTAs: [
      { label: "📅 RSVP Now", action: "confirm_rsvp" },
      { label: "⏰ Suggest Time", action: "open_scheduling_link" },
      { label: "📝 Ask Details", action: "open_reply_input" }
    ]
  },
  "product_inquiry": {
    description: "User is asking about product details",
    category: "Sales",
    defaultCTAs: [
      { label: "💰 Get Quote", action: "show_pricing" },
      { label: "📊 View Plans", action: "open_plan_list" },
      { label: "👤 Talk to Sales", action: "contact_sales" }
    ]
  },
  "default": {
    description: "General message without specific intent",
    category: "Engagement",
    defaultCTAs: [
      { label: "📤 Reply", action: "send_reply" },
      { label: "📅 Schedule Call", action: "open_scheduling_link" },
      { label: "📌 Save This", action: "vault_message" }
    ]
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Setup auth headers for OpenAI API
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const requestData: VoiceAnalysisRequest = await req.json();
    
    // Check if we have audio or transcript data
    if (!requestData.audio && !requestData.transcript) {
      throw new Error('Request must include audio or transcript');
    }

    let transcript = requestData.transcript || '';
    let detectedIntent = 'default';
    
    // If audio is provided, transcribe it
    if (requestData.audio) {
      try {
        console.log("Audio data received, sending to OpenAI for transcription");
        
        // Convert base64 to binary for Whisper API
        const audioBlob = Uint8Array.from(atob(requestData.audio), c => c.charCodeAt(0));
        
        // Create a FormData object to send to the Whisper API
        const formData = new FormData();
        formData.append('file', new Blob([audioBlob], { type: 'audio/webm' }), 'audio.webm');
        formData.append('model', 'whisper-1');
        
        const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: formData,
        });
        
        if (!transcriptionResponse.ok) {
          throw new Error(`OpenAI Transcription Error: ${transcriptionResponse.status} ${transcriptionResponse.statusText}`);
        }
        
        const transcriptionResult = await transcriptionResponse.json();
        transcript = transcriptionResult.text;
        console.log("Transcription result:", transcript);
      } catch (err) {
        console.error("Error transcribing audio:", err);
        if (requestData.transcript) {
          console.log("Using provided transcript as fallback");
          transcript = requestData.transcript;
        } else {
          throw new Error('Failed to transcribe audio and no fallback transcript provided');
        }
      }
    }
    
    // Now analyze the transcript to determine intent
    try {
      console.log("Analyzing transcript for intent");
      
      const intentSystemPrompt = `You are an AI trained to identify the primary intent of a voice message based on its transcript. 
      You must categorize the message into one of these intent types:
      - booking_request (scheduling a meeting or call)
      - follow_up (continuing a previous conversation)
      - information_request (asking for details or explanations)
      - social_invitation (inviting someone to an event)
      - product_inquiry (asking about features, pricing, etc.)
      - default (general message with no clear intent)
      
      Respond with ONLY the intent category, nothing else.`;
      
      const intentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: intentSystemPrompt },
            { role: 'user', content: transcript }
          ],
          temperature: 0.3,
          max_tokens: 50,
        }),
      });
      
      if (!intentResponse.ok) {
        throw new Error(`OpenAI Intent Analysis Error: ${intentResponse.status} ${intentResponse.statusText}`);
      }
      
      const intentResult = await intentResponse.json();
      const inferredIntent = intentResult.choices[0].message.content.trim().toLowerCase();
      
      // Check if the intent is one we recognize
      if (inferredIntent && (inferredIntent in intentMap || inferredIntent.includes('_'))) {
        detectedIntent = inferredIntent;
      }
      
      console.log("Detected intent:", detectedIntent);
      
      // Now generate appropriate CTAs based on the intent
      // Get intent data from our map
      const intentData = intentMap[detectedIntent] || intentMap.default;
      
      // For known intents, use our predefined CTAs
      const response: VoiceAnalysisResponse = {
        success: true,
        transcript,
        intent: detectedIntent,
        description: intentData.description,
        category: intentData.category,
        ctas: intentData.defaultCTAs,
      };

      console.log("Sending response with intent and CTAs");
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (err) {
      console.error("Error in intent analysis:", err);
      
      // Provide a simplified fallback response
      return new Response(JSON.stringify({
        success: true,
        transcript,
        intent: 'default',
        description: 'General message without specific intent',
        category: 'Engagement',
        ctas: intentMap.default.defaultCTAs,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Unknown error occurred",
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
