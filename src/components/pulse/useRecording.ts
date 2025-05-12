import { useState, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import type {} from '@/types/speechRecognition';

interface UseRecordingResult {
  isRecording: boolean;
  recordingTime: number;
  recordingData: Blob | null;
  transcription: string;
  suggestedCTAs: string[];
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
}

export const useRecording = (): UseRecordingResult => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingData, setRecordingData] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const [suggestedCTAs, setSuggestedCTAs] = useState<string[]>([]);
  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  const startRecording = async () => {
    try {
      // Reset states
      setTranscription('');
      setSuggestedCTAs([]);
      
      // Start audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });
      
      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setRecordingData(audioBlob);
        
        // After recording stops, analyze content to suggest CTAs
        analyzeContentForCTAs(transcription);
      });
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
      
      // Initialize speech recognition for real-time transcription
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          setTranscription((prev) => prev + finalTranscript + (interimTranscript ? ' ' + interimTranscript : ''));
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
        };
        
        recognition.start();
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        title: "Microphone Access Failed",
        description: "Please make sure you've allowed microphone access to record.",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      
      const tracks = mediaRecorderRef.current.stream.getTracks();
      tracks.forEach(track => track.stop());
      
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setIsRecording(false);
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  
  const resetRecording = () => {
    setRecordingData(null);
    setRecordingTime(0);
    setTranscription('');
    setSuggestedCTAs([]);
  };
  
  // Function to analyze content and suggest CTAs based on the transcription
  const analyzeContentForCTAs = (text: string) => {
    // Simple intent detection based on keywords
    const lowerText = text.toLowerCase();
    
    // Default CTAs if we can't determine specific intent
    const defaultCTAs = ['Contact Me', 'Learn More', 'Schedule Call'];
    
    // Simple keyword-based intent detection
    if (lowerText.includes('meeting') || lowerText.includes('schedule') || lowerText.includes('calendar')) {
      setSuggestedCTAs(['Schedule Meeting', 'Check My Calendar', 'Book a Time']);
    } else if (lowerText.includes('question') || lowerText.includes('help') || lowerText.includes('support')) {
      setSuggestedCTAs(['Ask a Question', 'Get Support', 'Contact Me']);
    } else if (lowerText.includes('purchase') || lowerText.includes('buy') || lowerText.includes('price')) {
      setSuggestedCTAs(['Purchase Now', 'View Pricing', 'Request Quote']);
    } else if (lowerText.includes('demo') || lowerText.includes('show') || lowerText.includes('example')) {
      setSuggestedCTAs(['Watch Demo', 'See Examples', 'Request Demo']);
    } else if (lowerText.includes('learn') || lowerText.includes('info') || lowerText.includes('more')) {
      setSuggestedCTAs(['Learn More', 'Download Info', 'Visit Website']);
    } else {
      setSuggestedCTAs(defaultCTAs);
    }
  };

  return {
    isRecording,
    recordingTime,
    recordingData,
    transcription,
    suggestedCTAs,
    startRecording,
    stopRecording,
    resetRecording
  };
};
