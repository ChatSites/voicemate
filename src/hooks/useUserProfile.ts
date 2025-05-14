
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Define the UserProfile interface
export interface UserProfile {
  id: string;
  name: string | null;
  pulse_id: string | null;
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
          console.error("Profile fetch error:", profileError);
          setError(profileError.message);
        } else if (data) {
          const userProfile: UserProfile = {
            id: data.id,
            name: user.user_metadata?.full_name ?? data.name ?? null,
            pulse_id: data.pulse_id ?? null,
          };
          setProfile(userProfile);
        }
      } catch (err: any) {
        console.error("Unexpected profile fetch error:", err);
        setError(err?.message || "Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error
  };
};
