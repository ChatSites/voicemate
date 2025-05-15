
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AudioPreview from '@/components/AudioPreview';
import UseCases from '@/components/UseCases';
import WhyItMatters from '@/components/WhyItMatters';
import Story from '@/components/Story';
import Technology from '@/components/Technology';
import HowItWorks from '@/components/HowItWorks';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import { useTheme } from '@/components/providers/ThemeProvider';

const Index = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    document.title = 'VoiceMate ID – Your Voice, Your Identity';
  }, []);

  return (
    <div className={`min-h-screen flex flex-col overflow-hidden ${isDark ? 'bg-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <Navbar />
      <Hero />
      <AudioPreview />
      <UseCases />
      <HowItWorks />
      <WhyItMatters />
      <Story />
      <Technology />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
