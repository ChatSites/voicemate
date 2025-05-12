import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  name: string;
  pulse_id: string;
  created_at?: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        setError("No user session found");
        setLoading(false);
        return;
      }

      const { data, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userData.user.id)
        .single();

      if (profileError) {
        setError(profileError.message);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
