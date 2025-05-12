
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

      // Use "users" table which exists in your database
      const { data, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userData.user.id)
        .single();

      if (profileError) {
        setError(profileError.message);
      } else if (data) {
        // Map the returned user data to our UserProfile interface
        const userProfile: UserProfile = {
          id: data.id,
          name: userData.user.user_metadata?.full_name || data.name || null,
          pulse_id: data.pulse_id || null,
          // These fields might not exist in your users table, but are in the interface
          created_at: undefined, // Not available in your table
          avatar_url: null // Not available in your table
        };
        setProfile(userProfile);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
