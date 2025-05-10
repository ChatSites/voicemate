
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Pause, Send, Trash2, Waveform } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

export default function SendPulse() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingData, setRecordingData] = useState<Blob | null>(null);
  const [pulseTitle, setPulseTitle] = useState('');
  const [pulseDescription, setPulseDescription] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, user, navigate]);
  
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);
  
  const startRecording = async () => {
    try {
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
      });
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
      
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
  };
  
  const resetRecording = () => {
    setRecordingData(null);
    setRecordingTime(0);
  };
  
  const handleSendPulse = async () => {
    if (!recordingData) {
      toast({
        title: "No Recording",
        description: "Please record a voice message before sending.",
        variant: "destructive"
      });
      return;
    }
    
    if (!pulseTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please add a title for your pulse.",
        variant: "destructive"
      });
      return;
    }
    
    // Show sending state
    setIsSending(true);
    
    // This is where you would upload the recording to the server
    // For now, we'll just show a success message after a delay
    setTimeout(() => {
      toast({
        title: "Pulse Sent!",
        description: "Your voice message has been sent successfully.",
      });
      setIsSending(false);
      navigate('/dashboard');
    }, 2000);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Create a New Pulse</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="bg-voicemate-card border-gray-800">
                <CardHeader>
                  <CardTitle>Record Voice Message</CardTitle>
                  <CardDescription>Record a clear message for the best experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      placeholder="Pulse Title"
                      value={pulseTitle}
                      onChange={(e) => setPulseTitle(e.target.value)}
                      className="bg-black/20 border-gray-700"
                    />
                    
                    <Textarea
                      placeholder="Description (optional)"
                      value={pulseDescription}
                      onChange={(e) => setPulseDescription(e.target.value)}
                      className="bg-black/20 border-gray-700 min-h-[120px]"
                    />
                    
                    <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-700 rounded-lg bg-black/30">
                      {recordingData ? (
                        <div className="w-full space-y-4">
                          <div className="flex items-center justify-center">
                            <audio src={URL.createObjectURL(recordingData)} controls className="w-full" />
                          </div>
                          <div className="flex justify-center space-x-3">
                            <Button
                              variant="outline"
                              className="border-gray-700"
                              onClick={resetRecording}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Discard
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-4">
                          {isRecording ? (
                            <div className="space-y-4">
                              <div className="flex justify-center">
                                <div className="waveform-container">
                                  {Array.from({ length: 12 }).map((_, i) => (
                                    <motion.div
                                      key={i}
                                      className="waveform-bar"
                                      animate={{
                                        height: Math.random() * 40 + 10,
                                      }}
                                      transition={{
                                        duration: 0.5,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="text-xl font-bold text-voicemate-red">{formatTime(recordingTime)}</div>
                              <Button
                                className="bg-voicemate-red hover:bg-red-600 text-white"
                                onClick={stopRecording}
                              >
                                <Pause className="mr-2 h-4 w-4" /> Stop Recording
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="p-8 rounded-full bg-voicemate-red/10 mb-4 inline-flex">
                                <Mic className="h-12 w-12 text-voicemate-red" />
                              </div>
                              <div>
                                <Button
                                  className="bg-voicemate-red hover:bg-red-600 text-white"
                                  onClick={startRecording}
                                >
                                  <Mic className="mr-2 h-4 w-4" /> Start Recording
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="bg-voicemate-purple hover:bg-purple-700 text-white w-full"
                    disabled={!recordingData || isSending}
                    onClick={handleSendPulse}
                  >
                    {isSending ? (
                      <>Sending Pulse...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send Pulse
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card className="bg-voicemate-card border-gray-800">
                <CardHeader>
                  <CardTitle>Tips for Great Pulses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 bg-voicemate-purple/20 p-1 rounded-full">
                        <Mic className="h-3 w-3 text-voicemate-purple" />
                      </div>
                      <span>Speak clearly and at a moderate pace</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 bg-voicemate-purple/20 p-1 rounded-full">
                        <Waveform className="h-3 w-3 text-voicemate-purple" />
                      </div>
                      <span>Find a quiet place with minimal background noise</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 bg-voicemate-purple/20 p-1 rounded-full">
                        <Send className="h-3 w-3 text-voicemate-purple" />
                      </div>
                      <span>Keep messages concise and focused</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 bg-voicemate-purple/20 p-1 rounded-full">
                        <Waveform className="h-3 w-3 text-voicemate-purple" />
                      </div>
                      <span>State your key points early in the recording</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
