
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

// Analyze text to determine intent and CTAs - improved prompt for better handling of longer messages
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
            Respond with a JSON object containing an array of 3-5 BRIEF, ACTION-ORIENTED phrases that would make good button text, each 1-5 words max.
            
            Make the CTAs very concise, actionable, and directly related to what the speaker wants to achieve.
            For example, if someone is inviting a friend to an event, good CTAs might be:
            - "Send Invitation"
            - "Book Travel"
            - "Check Calendar"
            - "Share Location"
            
            Always return at least 3 CTAs regardless of the transcript length.
            CTAs should be phrases, not complete sentences. Focus on the most likely actions the recipient would want to take.`
          },
          {
            role: 'user',
            content: `Analyze this voice message transcript and suggest relevant CTAs: "${text}"`
          }
        ],
        temperature: 0.2,
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
      // Try to parse as JSON first
      const parsedContent = JSON.parse(result.choices[0].message.content);
      return parsedContent;
    } catch (e) {
      // If not valid JSON, extract CTAs from text
      const content = result.choices[0].message.content;
      
      // Extract CTAs from the content
      const ctas = content.split('\n')
        .filter((line: string) => line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map((line: string) => line.replace(/^[-*]\s+/, '').replace(/"/g, '').trim());
      
      // If we couldn't extract CTAs, provide some defaults
      if (ctas.length === 0) {
        return {
          ctas: ["Plan Trip", "Boat Invitation", "Check Calendar", "Confirm Details"]
        };
      }
      
      return { ctas };
    }
  } catch (error) {
    console.error('Error analyzing intent:', error);
    // Return default CTAs if analysis fails
    return {
      ctas: ["Send Message", "Schedule Meeting", "Follow Up", "Confirm Plans"]
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
          ctas: intentAnalysis.ctas || ["Send Message", "Schedule Meeting", "Follow Up", "Confirm Plans"]
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
          ctas: intentAnalysis.ctas || ["Send Message", "Schedule Meeting", "Follow Up", "Confirm Plans"]
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
        ctas: ["Send Message", "Schedule Meeting", "Follow Up", "Confirm Plans"] 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
