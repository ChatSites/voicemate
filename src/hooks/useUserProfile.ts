
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile for user:', user.id);
        
        // Use "users" table which exists in your database
        const { data, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
          setError(profileError.message);
        } else if (data) {
          console.log('Profile fetched successfully:', data);
          // Map the returned user data to our UserProfile interface
          const userProfile: UserProfile = {
            id: data.id,
            name: user.user_metadata?.full_name || data.name || null,
            pulse_id: data.pulse_id || null,
            created_at: data.created_at,
            avatar_url: data.avatar_url || null
          };
          setProfile(userProfile);
        } else {
          console.log('No profile found for user:', user.id);
        }
      } catch (err: any) {
        console.error('Exception fetching profile:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  return { profile, loading, error };
};
