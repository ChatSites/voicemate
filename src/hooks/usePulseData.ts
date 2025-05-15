
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
        const { data, error } = await supabase
          .from('pulses')
          .select('*')
          .eq('id', pulseId)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
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
          setError(new Error('Pulse not found'));
        }
      } catch (error) {
        console.error('Error fetching pulse:', error);
        setError(error instanceof Error ? error : new Error('Failed to load pulse data'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPulse();
  }, [pulseId]);

  return { pulse, loading, error };
};
