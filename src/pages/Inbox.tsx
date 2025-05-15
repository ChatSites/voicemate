
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InboxHeader from '@/components/inbox/InboxHeader';
import InboxContent from '@/components/inbox/InboxContent';
import { useInboxState } from '@/hooks/useInboxState';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function InboxPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { 
    selectedPulseId, 
    isPlaying, 
    selectedPulses, 
    isDeleting,
    pulses,
    loading,
    activeTab,
    setActiveTab,
    handlePlayPulse, 
    handleToggleSelect, 
    handleSelectAll, 
    handleDeleteSelected,
    handleArchiveSelected,
    handleUnarchiveSelected
  } = useInboxState();
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);
  
  if (authLoading) {
    return (
      <div className={`h-screen w-full flex items-center justify-center ${isDark ? 'bg-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <div className="text-center">
          <p className="text-muted-foreground">Loading inbox...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <InboxHeader 
          selectedCount={selectedPulses.length} 
          onDeleteSelected={handleDeleteSelected} 
          onArchiveSelected={handleArchiveSelected}
          onUnarchiveSelected={handleUnarchiveSelected}
          isDeleting={isDeleting}
          activeTab={activeTab}
        />
        <InboxContent 
          pulses={pulses}
          loading={loading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onPlayPulse={handlePlayPulse} 
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          selectedPulses={selectedPulses}
        />
      </div>
      <Footer />
    </div>
  );
}
