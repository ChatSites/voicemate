
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import UseCasesComponent from '@/components/UseCases';
import { useTheme } from '@/components/providers/ThemeProvider';

const UseCases = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <>
      <SEO 
        title="Use Cases – VoiceMate Pulse ID"
        description="Discover practical use cases for VoiceMate. Perfect for businesses, creators, professionals, and anyone who values uninterrupted communication."
        url="https://voicemate.id/use-cases"
        keywords="use cases, business communication, voice messages, professional networking, creator tools, VoiceMate applications"
      />
      <div className={`min-h-screen flex flex-col ${isDark ? 'bg-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <Navbar />
        <main className="flex-1 pt-20">
          <UseCasesComponent />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default UseCases;
