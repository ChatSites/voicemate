
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  name: string | null;
  pulse_id: string | null;
  created_at?: string;
  avatar_url?: string | null;
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

      // Fix: use "profiles" table instead of "users"
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single();

      if (profileError) {
        setError(profileError.message);
      } else if (data) {
        // Map the returned profile data to our UserProfile interface
        setProfile({
          id: data.id,
          name: userData.user.user_metadata?.full_name || null,
          pulse_id: data.username || null,
          created_at: data.created_at,
          avatar_url: data.avatar_url
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
