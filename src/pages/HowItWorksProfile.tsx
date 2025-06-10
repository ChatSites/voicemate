
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import HowItWorksTab from '@/components/profile/HowItWorksTab';
import { useTheme } from '@/components/providers/ThemeProvider';

const HowItWorksProfile = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <>
      <SEO 
        title="How It Works – VoiceMate Profile Guide"
        description="Learn how to use VoiceMate effectively. Complete guide to setting up your profile, sharing your PulseID, and managing voice messages."
        url="https://voicemate.id/profile/how-it-works"
      />
      <div className={`min-h-screen flex flex-col ${isDark ? 'bg-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <Navbar />
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">How It Works</h1>
              <p className="text-muted-foreground">
                Complete guide to using VoiceMate effectively
              </p>
            </div>
            <HowItWorksTab />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HowItWorksProfile;
