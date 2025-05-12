
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Intent-to-CTA mapping - structured set of possible CTAs and actions
const intentToCTAMap = {
  "travel_invitation": [
    "Plan Trip",
    "Check Calendar",
    "Book Travel",
    "Confirm Dates"
  ],
  "scheduling": [
    "Schedule Meeting",
    "Check Calendar", 
    "Confirm Dates",
    "Set Reminder"
  ],
  "follow_up": [
    "Remind Later",
    "Send Follow-up",
    "Check Calendar",
    "Make Note"
  ],
  "invitation": [
    "Accept Invitation",
    "Check Calendar",
    "Request Details",
    "Share Plan"
  ],
  "boat_related": [
    "Boat Invitation",
    "Plan Trip",
    "Check Availability",
    "Weather Check"
  ],
  "social_gathering": [
    "RSVP Now",
    "Check Calendar",
    "Suggest Time",
    "Ask Details"
  ],
  "default": [
    "Send Message",
    "Schedule Meeting",
    "Follow Up",
    "Confirm Plans"
  ]
};

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  console.log("Processing base64 audio, length:", base64String.length);
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  console.log("Finished processing audio data, size:", result.length);
  return result;
}

// Enhanced function to analyze intent and determine relevance
async function analyzeIntent(text: string) {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    console.log("Analyzing intent for text:", text);
    
    // If the transcript is too short, return a default response
    if (text.trim().length < 5) {
      console.log("Transcript too short for meaningful analysis, using defaults");
      return {
        intent: "default",
        ctas: intentToCTAMap.default
      };
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You analyze voice message transcripts to identify the speaker's primary intent.
            First, determine the category of intent from these options:
            - travel_invitation (planning trips, vacations, outings)
            - scheduling (setting up meetings, calls, appointments)
            - follow_up (continuing conversations, checking status)
            - invitation (inviting others to events, activities)
            - boat_related (discussions about boats, boating, water activities)
            - social_gathering (parties, get-togethers, social events)
            - default (if none of the above apply)

            After analyzing the transcript, respond with a simple JSON object containing:
            1. The most appropriate intent category
            2. A brief 1-5 word description of what the user wants
            
            Example response format:
            {"intent": "travel_invitation", "description": "Arizona boat trip invitation"}
            
            Be concise and direct. Focus on the primary goal of the message.`
          },
          {
            role: 'user',
            content: `Analyze this voice message transcript and determine the intent: "${text}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 150
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const result = await response.json();
    console.log("Intent analysis result:", result.choices[0].message.content);
    
    try {
      // Parse the AI response
      const intentResult = JSON.parse(result.choices[0].message.content);
      const identifiedIntent = intentResult.intent || "default";
      
      // Get CTAs based on the identified intent
      const suggestedCTAs = intentToCTAMap[identifiedIntent] || intentToCTAMap.default;
      
      return {
        intent: identifiedIntent,
        description: intentResult.description || "",
        ctas: suggestedCTAs
      };
    } catch (e) {
      console.error("Error parsing AI response:", e);
      // Return default CTAs if parsing fails
      return {
        intent: "default",
        description: "Failed to parse intent",
        ctas: intentToCTAMap.default
      };
    }
  } catch (error) {
    console.error('Error analyzing intent:', error);
    // Return default CTAs if analysis fails
    return {
      intent: "default", 
      description: "Error in analysis",
      ctas: intentToCTAMap.default
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, audio } = await req.json();
    console.log(`Received request with ${transcript ? 'transcript' : 'no transcript'} and ${audio ? 'audio' : 'no audio'}`);
    
    // If we have a transcript already, analyze it directly
    if (transcript) {
      console.log("Using provided transcript for analysis:", transcript);
      const intentAnalysis = await analyzeIntent(transcript);
      return new Response(
        JSON.stringify({
          success: true,
          intent: intentAnalysis.intent,
          description: intentAnalysis.description,
          ctas: intentAnalysis.ctas
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If we have audio, transcribe it first
    else if (audio) {
      // Process audio in chunks
      const binaryAudio = processBase64Chunks(audio);
      console.log("Processing audio data, size:", binaryAudio.length);
      
      // Prepare form data for Whisper API
      const formData = new FormData();
      const blob = new Blob([binaryAudio], { type: 'audio/webm' });
      formData.append('file', blob, 'audio.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');
      formData.append('response_format', 'json');

      // Call OpenAI's Whisper API
      const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
      console.log("Sending audio to OpenAI Whisper API...");
      const transcribeResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: formData,
      });

      if (!transcribeResponse.ok) {
        const errorText = await transcribeResponse.text();
        console.error("Whisper API error:", errorText);
        throw new Error(`OpenAI transcription error: ${errorText}`);
      }

      const transcriptionResult = await transcribeResponse.json();
      const transcribedText = transcriptionResult.text;
      console.log("Transcription result:", transcribedText);
      
      // Analyze the transcript for intent
      const intentAnalysis = await analyzeIntent(transcribedText);
      
      return new Response(
        JSON.stringify({
          success: true,
          transcript: transcribedText,
          intent: intentAnalysis.intent,
          description: intentAnalysis.description,
          ctas: intentAnalysis.ctas
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error('Request must include either transcript or audio');
    }
  } catch (error) {
    console.error('Error in voice-analysis function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        intent: "default",
        description: "Error processing request",
        ctas: intentToCTAMap.default
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
