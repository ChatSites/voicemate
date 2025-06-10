
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import ProfileContent from '@/components/profile/ProfileContent';
import { useTheme } from '@/components/providers/ThemeProvider';

const Profile = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <>
      <SEO 
        title="Profile & Settings – VoiceMate Pulse ID"
        description="Manage your VoiceMate profile, PulseID settings, preferences, and account information."
        url="https://voicemate.id/profile"
        noIndex={true}
      />
      <div className={`min-h-screen flex flex-col ${isDark ? 'bg-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <Navbar />
        <main className="flex-1 pt-20">
          <ProfileContent />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Profile;
