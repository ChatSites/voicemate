
import * as React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  // Creating an animated waveform effect
  const bars = Array(20).fill(0);
  
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-30" />
      
      {/* Hero content */}
      <motion.div 
        className="text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-voicemate-purple to-voicemate-red rounded-full opacity-20 animate-pulse-slow"></div>
            <div className="w-32 h-32 rounded-full bg-voicemate-dark flex items-center justify-center text-4xl">
              <span role="img" aria-label="microphone">🎤</span>
            </div>
          </div>
        </motion.div>

        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="text-gradient">VoiceMate™</span>
        </motion.h1>
        
        <motion.h2
          className="text-2xl md:text-3xl font-medium mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <span className="text-gradient">Your Voice. Your Identity. Your Time.</span>
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          VoiceMate™ is a voice-first, AI-powered communication platform that replaces the chaos of modern messaging — spam calls, missed texts, and cluttered inboxes — with something radically better:
          <span className="font-semibold block mt-2">asynchronous, intelligent voice messaging that respects your time.</span>
        </motion.p>

        {/* Animated waveform */}
        <motion.div 
          className="waveform-container mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {bars.map((_, i) => (
            <motion.div
              key={i}
              className="waveform-bar"
              initial={{ height: 5 }}
              animate={{ 
                height: [5, 15 + Math.random() * 30, 5],
                backgroundColor: i % 2 === 0 ? "#fa4b53" : "#9b5de5"
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.05,
              }}
            />
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <Button 
            size="lg" 
            asChild
            className="bg-voicemate-red hover:bg-red-600 text-white rounded-full px-8 py-6 text-lg button-glow transition-all hover:scale-105"
          >
            <Link to="/reserve">
              🎤 Claim Your PulseID
            </Link>
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Decorative circles */}
      <div className="absolute top-1/4 -right-28 w-96 h-96 bg-voicemate-purple opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-28 w-96 h-96 bg-voicemate-red opacity-10 rounded-full blur-3xl" />
    </section>
  );
}
