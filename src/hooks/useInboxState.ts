
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useInboxState = () => {
  const [selectedPulseId, setSelectedPulseId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPulses, setSelectedPulses] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  
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
      // In a real app, this would delete the pulses from the database
      // const { error } = await supabase
      //   .from('pulses')
      //   .delete()
      //   .in('id', selectedPulses);
      
      // if (error) throw error;
      
      // Since we're using mock data, we'll just show a toast
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
  
  return {
    selectedPulseId,
    isPlaying,
    selectedPulses,
    isDeleting,
    handlePlayPulse,
    handleToggleSelect,
    handleSelectAll,
    handleDeleteSelected,
  };
};
