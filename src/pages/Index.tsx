
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

const Index = () => {
  useEffect(() => {
    document.title = 'VoiceMate ID – Your Voice, Your Identity';
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-black text-white">
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
