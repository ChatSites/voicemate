
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Pulse, CTA } from '@/types/pulse';

export const usePulseData = (pulseId: string | undefined) => {
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPulse = async () => {
      if (!pulseId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`Fetching pulse with ID: ${pulseId}`);
        
        // The RLS policy will automatically filter results based on the current user's pulse_id
        // Only pulses sent to the current user will be returned
        const { data, error } = await supabase
          .from('pulses')
          .select('*')
          .eq('id', pulseId)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching pulse:', error);
          throw error;
        }
        
        if (data) {
          console.log('Pulse data found:', data);
          // Convert database ctas data to proper format
          const formattedData: Pulse = {
            ...data,
            ctas: Array.isArray(data.ctas) 
              ? data.ctas.map((cta: any) => ({
                  label: cta.label || '',
                  action: cta.action || '',
                  url: cta.url,
                  emoji: cta.emoji
                }))
              : []
          };
          
          setPulse(formattedData);
        } else {
          console.log('No pulse found or access denied due to RLS policy');
          setError(new Error('Pulse not found or access denied'));
        }
      } catch (error) {
        console.error('Error fetching pulse:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load pulse data';
        
        // Provide user-friendly error messages for common RLS scenarios
        if (errorMessage.includes('insufficient privilege') || errorMessage.includes('permission denied')) {
          setError(new Error('You do not have permission to view this pulse'));
        } else {
          setError(new Error(errorMessage));
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchPulse();
  }, [pulseId]);

  return { pulse, loading, error };
};
