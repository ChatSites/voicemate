
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import HowItWorksComponent from '@/components/HowItWorks';
import { useTheme } from '@/components/providers/ThemeProvider';

const HowItWorks = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <>
      <SEO 
        title="How It Works – VoiceMate Pulse ID"
        description="Learn how VoiceMate works. Share your PulseID link, receive voice messages, and let our AI handle everything with smart transcription and replies."
        url="https://voicemate.id/how-it-works"
        keywords="how it works, voice messages, AI transcription, smart replies, PulseID, voice communication"
      />
      <div className={`min-h-screen flex flex-col ${isDark ? 'bg-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <Navbar />
        <main className="flex-1 pt-20">
          <HowItWorksComponent />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HowItWorks;
