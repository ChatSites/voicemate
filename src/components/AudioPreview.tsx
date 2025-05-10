
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, PauseCircle, Headphones, MessageSquare, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AudioPreview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [showingTranscription, setShowingTranscription] = useState(false);
  const [showingCTAs, setShowingCTAs] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrl = "https://vzbadytmoatrwrvgemne.supabase.co/storage/v1/object/public/pulses-audio/d0666d7b-849d-4c86-8e2d-e2fe49532ab0.webm";

  // Example transcription (in a real app, this would come from an API)
  const fullTranscription = "Hi there! Thanks for checking out VoiceMate. We're building a better way to communicate that respects everyone's time. Leave me a message anytime, and I'll get back to you when I can. No more phone tag, no more interruptions - just clear communication on your schedule.";

  useEffect(() => {
    // Initialize audio
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      setProgress(audio.currentTime / audio.duration);
      
      // Show transcription gradually based on playback progress
      const progressPercentage = (audio.currentTime / audio.duration) * 100;
      if (progressPercentage > 5 && !showingTranscription) {
        setShowingTranscription(true);
      }
      
      // Calculate how much of the transcription to show based on progress
      const transcriptionLength = Math.floor((audio.currentTime / audio.duration) * fullTranscription.length);
      setTranscription(fullTranscription.substring(0, transcriptionLength));
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
      setShowingCTAs(true);
    });
    
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, []);
  
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };
  
  return (
    <section className="py-12 px-4 bg-black relative" id="audio-preview">
      <div className="absolute inset-0 bg-gradient-to-b from-voicemate-dark/20 to-transparent opacity-40"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gradient">
            <span role="img" aria-label="headphones" className="block mb-4">🎧</span>
            Try a Pulse
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-voicemate-card p-6 rounded-xl border border-gray-800 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-voicemate-red flex items-center justify-center">
                {isPlaying ? (
                  <PauseCircle className="h-6 w-6 text-white" />
                ) : (
                  <Play className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-400">Rick Jacket</p>
                <p className="font-medium">VoiceMate Intro</p>
              </div>
            </div>
            <Button 
              onClick={togglePlayPause} 
              variant="outline" 
              className="border-gray-700 hover:bg-voicemate-red hover:text-white hover:border-voicemate-red"
            >
              {isPlaying ? "Pause" : "Play"}
            </Button>
          </div>
          
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-voicemate-red h-full rounded-full transition-all duration-100"
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>{formatTime(duration * progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </motion.div>
        
        {showingTranscription && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 mb-8 text-left"
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-200">Transcription</h3>
            <p className="text-gray-300">{transcription}</p>
          </motion.div>
        )}
        
        {showingCTAs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
          >
            <Button 
              asChild
              size="lg" 
              className="bg-voicemate-purple hover:bg-voicemate-purple/90 text-white flex items-center gap-2"
            >
              <Link to="/reserve">
                <Mic className="h-4 w-4" /> Get Your Own Pulse
              </Link>
            </Button>
            
            <Button 
              asChild
              size="lg" 
              variant="outline" 
              className="border-gray-700 hover:bg-gray-800 flex items-center gap-2"
            >
              <a href="https://voicemate.id/pulse/rickj" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="h-4 w-4" /> Leave a Message
              </a>
            </Button>
            
            <Button 
              asChild
              size="lg" 
              variant="outline" 
              className="border-gray-700 hover:bg-gray-800 flex items-center gap-2"
            >
              <a href="#how-it-works">
                <Headphones className="h-4 w-4" /> How It Works
              </a>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Helper function to format time in MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
