
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { UseRecordingResult } from '@/components/pulse/types/speechRecognition';
import { initSpeechRecognition } from '../services/speechRecognitionService';
import { processAudioRecording } from '../services/audioProcessingService';

export const useRecording = (): UseRecordingResult => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingData, setRecordingData] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const [suggestedCTAs, setSuggestedCTAs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any | null>(null);
  const fullTranscriptRef = useRef<string>('');
  const audioChunksRef = useRef<Blob[]>([]);
  
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
      fullTranscriptRef.current = '';
      setSuggestedCTAs([]);
      audioChunksRef.current = [];
      
      // Start audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      mediaRecorder.addEventListener('stop', async () => {
        console.log("Media recorder stopped");
        console.log("Audio chunks collected:", audioChunksRef.current.length);
        
        if (audioChunksRef.current.length === 0) {
          toast({
            title: "Recording Error",
            description: "No audio data was captured. Please try again.",
            variant: "destructive"
          });
          return;
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log("Audio blob created, size:", audioBlob.size);
        setRecordingData(audioBlob);
        setIsProcessing(true);
        
        try {
          // Process audio recording with AI
          const result = await processAudioRecording(audioBlob, fullTranscriptRef.current);
          
          // If we didn't have a complete transcript from speech recognition, use the one from the API
          if (!fullTranscriptRef.current && result.transcript) {
            fullTranscriptRef.current = result.transcript;
            setTranscription(result.transcript);
          }
          
          // Set the suggested CTAs if available
          if (result.ctas && result.ctas.length > 0) {
            setSuggestedCTAs(result.ctas);
          }
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
      
      mediaRecorder.start(1000); // Collect data in 1-second chunks
      console.log("Media recorder started");
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
      
      // Initialize speech recognition for real-time transcription
      const recognition = initSpeechRecognition(
        // Update the transcription state
        (currentTranscript) => {
          setTranscription(currentTranscript);
        },
        // Update the full transcript ref
        (fullTranscript) => {
          fullTranscriptRef.current = fullTranscript;
        }
      );
      
      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
        console.log("Speech recognition started");
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
    console.log("Stopping recording...");
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
      console.log("Speech recognition stopped");
    }
  };
  
  const resetRecording = () => {
    setRecordingData(null);
    setRecordingTime(0);
    setTranscription('');
    fullTranscriptRef.current = '';
    setSuggestedCTAs([]);
    audioChunksRef.current = [];
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
