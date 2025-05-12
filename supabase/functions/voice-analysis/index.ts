
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
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

  return result;
}

// Analyze text to determine intent and CTAs
async function analyzeIntent(text: string) {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
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
            content: `You are an AI that analyzes voice message transcripts to identify the speaker's intent and suggest relevant call-to-action buttons.
            Respond with a JSON object containing:
            1. "intent": A brief label describing the main intent (e.g., "scheduling_request", "pricing_inquiry", "feedback")
            2. "category": Broader category (e.g., "meeting", "sales", "support")
            3. "label": Human-readable label for the intent (e.g., "Wants to Schedule a Meeting")
            4. "ctas": Array of suggested CTA buttons, each with "label" and "action" properties.
            
            Available actions:
            - open_scheduling_link
            - open_reschedule
            - open_reply_input
            - show_pricing
            - open_pricing_form
            - vault_message
            - unsubscribe_user
            - share_packet
            - open_feedback_form
            
            ONLY use these predefined actions.`
          },
          {
            role: 'user',
            content: `Analyze this voice message transcript and suggest relevant CTAs: "${text}"`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const result = await response.json();
    return JSON.parse(result.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing intent:', error);
    throw error;
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
      const intentAnalysis = await analyzeIntent(transcript);
      return new Response(
        JSON.stringify({
          success: true,
          ...intentAnalysis
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If we have audio, transcribe it first
    else if (audio) {
      // Process audio in chunks
      const binaryAudio = processBase64Chunks(audio);
      
      // Prepare form data for Whisper API
      const formData = new FormData();
      const blob = new Blob([binaryAudio], { type: 'audio/webm' });
      formData.append('file', blob, 'audio.webm');
      formData.append('model', 'whisper-1');

      // Call OpenAI's Whisper API
      const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
      const transcribeResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: formData,
      });

      if (!transcribeResponse.ok) {
        throw new Error(`OpenAI transcription error: ${await transcribeResponse.text()}`);
      }

      const transcriptionResult = await transcribeResponse.json();
      const transcribedText = transcriptionResult.text;
      
      // Analyze the transcript for intent
      const intentAnalysis = await analyzeIntent(transcribedText);
      
      return new Response(
        JSON.stringify({
          success: true,
          transcript: transcribedText,
          ...intentAnalysis
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
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
