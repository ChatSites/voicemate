
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import InboxHeader from '@/components/inbox/InboxHeader';
import InboxContent from '@/components/inbox/InboxContent';

export default function InboxPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedPulseId, setSelectedPulseId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, user, navigate]);
  
  const handlePlayPulse = (id: string) => {
    setSelectedPulseId(id);
    setIsPlaying(true);
    // In a real app, this would play the audio
    
    // For demo purposes, we'll just toggle the play state after 3 seconds
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };
  
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading inbox...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <InboxHeader />
        <InboxContent onPlayPulse={handlePlayPulse} />
      </div>
    </div>
  );
}
