import { useState, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  const [isProcessing, setIsProcessing] = useState(false);
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
      
      mediaRecorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setRecordingData(audioBlob);
        setIsProcessing(true);
        
        try {
          // Use the OpenAI API through our Supabase edge function
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          
          reader.onloadend = async () => {
            // Extract base64 data from the data URL
            const base64Audio = (reader.result as string).split(',')[1];
            
            const { data, error } = await supabase.functions.invoke('voice-analysis', {
              body: {
                audio: base64Audio
              }
            });
            
            if (error) {
              console.error("Edge function error:", error);
              toast({
                title: "Processing Error",
                description: "Failed to analyze your voice message. Please try again.",
                variant: "destructive"
              });
              return;
            }
            
            if (data.success) {
              setTranscription(data.transcript || '');
              
              // Process CTAs
              if (data.ctas && Array.isArray(data.ctas)) {
                const ctaLabels = data.ctas.map((cta: { label: string }) => cta.label);
                setSuggestedCTAs(ctaLabels);
              }
            }
          };
        } catch (err) {
          console.error("Error processing audio:", err);
          toast({
            title: "Processing Error",
            description: "An error occurred while processing your recording.",
            variant: "destructive"
          });
        } finally {
          setIsProcessing(false);
        }
      });
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
      
      // Initialize speech recognition for real-time transcription
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognitionAPI();
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
