
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
      try {
        if (!user?.id) {
          console.log("No user ID available for profile fetch");
          setLoading(false);
          return;
        }

        console.log("Fetching profile for user ID:", user.id);

        // Select from the recreated users table
        const { data, error: profileError } = await supabase
          .from('users')
          .select('id, name, pulse_id')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          setError(profileError.message);
        } else if (data) {
          console.log("Profile data received:", data);
          const userProfile: UserProfile = {
            id: data.id,
            name: data.name ?? user.user_metadata?.full_name ?? null,
            pulse_id: data.pulse_id ?? null,
          };
          setProfile(userProfile);
        } else {
          console.log("No profile data found for user, creating from metadata");
          // Handle case where user exists in auth but not in users table yet
          const userProfile: UserProfile = {
            id: user.id,
            name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? null,
            pulse_id: user.user_metadata?.pulse_id ?? null,
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
