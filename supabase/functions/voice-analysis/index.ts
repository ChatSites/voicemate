
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
    console.log("Analyzing intent for text:", text);
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
            3. "label": Human-readable label for the intent (e.g., "Schedule a Meeting")
            4. "ctas": Array of 2-5 BRIEF, ACTION-ORIENTED phrases that would make good button text, each 1-5 words max.
            
            Make the CTAs very concise, actionable, and directly related to what the speaker wants to achieve.
            For example, if someone is asking about pricing, good CTAs might be:
            - "View Pricing"
            - "Request Quote"
            - "Talk to Sales"
            
            CTAs should be phrases, not complete sentences.`
          },
          {
            role: 'user',
            content: `Analyze this voice message transcript and suggest relevant CTAs: "${text}"`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error}`);
    }

    const result = await response.json();
    console.log("Intent analysis result:", result.choices[0].message.content);
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
      console.log("Using provided transcript for analysis:", transcript);
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
