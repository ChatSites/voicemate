
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Create placeholder audio data for visualization
const generatePlaceholderWaveform = () => {
  return Array(40).fill(0).map(() => Math.random() * 50 + 10);
};

export default function AudioPreview() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const waveformData = generatePlaceholderWaveform();
  
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <section className="py-24 px-4" id="try-pulse">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            ▶️ Try a Pulse
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Experience a real async voice message.
          </motion.p>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="max-w-3xl mx-auto bg-voicemate-card border border-gray-800">
            <CardContent className="p-6">
              <p className="text-lg font-medium mb-6">
                <span className="text-voicemate-purple font-semibold">VoiceMate Preview:</span> Jimmy, leave me a quick voice update here whenever you get a sec.
              </p>
              
              <div className="relative mb-4 bg-black/30 rounded-lg p-6">
                {/* Waveform visualization */}
                <div className="flex items-center h-24 gap-[2px]">
                  {waveformData.map((height, index) => (
                    <motion.div
                      key={index}
                      className="w-1.5 rounded-full bg-gradient-to-t from-voicemate-red to-voicemate-purple"
                      style={{
                        height: `${height}%`,
                        opacity: progress / 100 > index / waveformData.length ? 1 : 0.4
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.01, duration: 0.5 }}
                    />
                  ))}
                </div>
                
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-gray-700 rounded-full mt-4">
                  <div 
                    className="h-full bg-voicemate-purple rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                {/* Audio controls */}
                <div className="mt-4 flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-full border-gray-700 hover:bg-voicemate-purple/20 hover:border-voicemate-purple transition-colors"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    )}
                  </Button>
                  
                  <div className="text-sm text-gray-400">00:24</div>
                </div>
              </div>
              
              <audio 
                ref={audioRef}
                className="hidden"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                src="https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3"
              />
              
              <div className="flex justify-end mt-4">
                <Button
                  variant="default"
                  className="bg-voicemate-purple hover:bg-voicemate-purple/90"
                >
                  Send a Response
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
