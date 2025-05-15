
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useInboxState = () => {
  const [selectedPulseId, setSelectedPulseId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPulses, setSelectedPulses] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pulses, setPulses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inbox');
  const { user } = useAuth();
  
  // Fetch pulses based on active tab
  useEffect(() => {
    const fetchPulses = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get the user's pulseId
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('pulse_id')
          .eq('id', user.id)
          .single();
        
        if (userError) throw userError;
        
        if (!userData?.pulse_id) {
          setPulses([]);
          setLoading(false);
          return;
        }
        
        // Fetch pulses addressed to the user's pulseId with the current status
        const { data: pulseData, error: pulseError } = await supabase
          .from('pulses')
          .select('*')
          .eq('pulse_id', userData.pulse_id)
          .eq('status', activeTab)
          .order('created_at', { ascending: false });
          
        if (pulseError) throw pulseError;
        
        setPulses(pulseData || []);
      } catch (error) {
        console.error('Error fetching pulses:', error);
        toast({
          title: "Error",
          description: "Failed to load your messages",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPulses();
    
    // Clear selections when changing tabs
    setSelectedPulses([]);
    
  }, [user, activeTab]);
  
  const handlePlayPulse = (id: string) => {
    setSelectedPulseId(id);
    setIsPlaying(true);
    // In a real app, this would play the audio
    
    // For demo purposes, we'll just toggle the play state after 3 seconds
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedPulses(prev => {
      if (prev.includes(id)) {
        return prev.filter(pulseId => pulseId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = (pulseIds: string[]) => {
    // If all are already selected, deselect all
    if (pulseIds.every(id => selectedPulses.includes(id))) {
      setSelectedPulses([]);
    } else {
      setSelectedPulses(pulseIds);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPulses.length === 0) return;
    
    setIsDeleting(true);
    try {
      // First update the status to 'deleted'
      const { error } = await supabase
        .from('pulses')
        .update({ status: 'deleted' })
        .in('id', selectedPulses);
      
      if (error) throw error;
      
      // Remove deleted pulses from the state
      setPulses(prev => prev.filter(pulse => !selectedPulses.includes(pulse.id)));
      
      toast({
        title: "Pulses Deleted",
        description: `${selectedPulses.length} pulse(s) have been deleted`,
      });
      
      // Clear selected pulses after deletion
      setSelectedPulses([]);
    } catch (error) {
      console.error('Error deleting pulses:', error);
      toast({
        title: "Error",
        description: "Failed to delete pulses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchiveSelected = async () => {
    if (selectedPulses.length === 0) return;
    
    setIsDeleting(true);
    try {
      // Update status to 'archived'
      const { error } = await supabase
        .from('pulses')
        .update({ status: 'archived' })
        .in('id', selectedPulses);
      
      if (error) throw error;
      
      // Remove archived pulses from the inbox view
      if (activeTab === 'inbox') {
        setPulses(prev => prev.filter(pulse => !selectedPulses.includes(pulse.id)));
      }
      
      toast({
        title: "Pulses Archived",
        description: `${selectedPulses.length} pulse(s) have been archived`,
      });
      
      // Clear selected pulses after archiving
      setSelectedPulses([]);
    } catch (error) {
      console.error('Error archiving pulses:', error);
      toast({
        title: "Error",
        description: "Failed to archive pulses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUnarchiveSelected = async () => {
    if (selectedPulses.length === 0) return;
    
    setIsDeleting(true);
    try {
      // Update status back to 'inbox'
      const { error } = await supabase
        .from('pulses')
        .update({ status: 'inbox' })
        .in('id', selectedPulses);
      
      if (error) throw error;
      
      // Remove unarchived pulses from the archive view
      if (activeTab === 'archived') {
        setPulses(prev => prev.filter(pulse => !selectedPulses.includes(pulse.id)));
      }
      
      toast({
        title: "Pulses Moved to Inbox",
        description: `${selectedPulses.length} pulse(s) have been moved to inbox`,
      });
      
      // Clear selected pulses after unarchiving
      setSelectedPulses([]);
    } catch (error) {
      console.error('Error unarchiving pulses:', error);
      toast({
        title: "Error",
        description: "Failed to move pulses to inbox. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
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
  };
};
