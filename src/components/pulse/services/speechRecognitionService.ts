
import { toast } from '@/hooks/use-toast';
import { SpeechRecognition } from '../types/speechRecognition';

export const initSpeechRecognition = (
  onTranscriptUpdate: (transcript: string) => void,
  onTranscriptComplete: (fullTranscript: string) => void
): SpeechRecognition | null => {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    console.warn('Speech recognition not supported in this browser');
    return null;
  }

  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionAPI();
  let fullTranscript = '';
  
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  
  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
        // Add to full transcript
        fullTranscript += " " + event.results[i][0].transcript;
        // Also pass the complete transcript separately
        onTranscriptComplete(fullTranscript.trim());
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    
    const currentTranscript = fullTranscript + 
      (interimTranscript ? ' ' + interimTranscript : '');
    onTranscriptUpdate(currentTranscript.trim());
    
    // Log for debugging
    console.log("Live transcription update:", currentTranscript);
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
  };

  console.log("Speech recognition initialized");
  return recognition;
};

