
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Using @ alias instead of relative path
import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  id: string;
  name: string | null;
  pulse_id: string | null;
  created_at?: string; // Keep as optional property
  avatar_url?: string | null; // Keep as optional property
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Only select columns that exist in the users table
        const { data, error: profileError } = await supabase
          .from('users')
          .select('id, name, pulse_id')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          setError(profileError.message);
        } else if (data) {
          const userProfile: UserProfile = {
            id: data.id,
            name: user.user_metadata?.full_name ?? data.name ?? null,
            pulse_id: data.pulse_id ?? null,
            // We won't set created_at and avatar_url since they don't exist in the table
          };
          setProfile(userProfile);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading, error };
};
