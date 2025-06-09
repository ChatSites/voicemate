
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Define the UserProfile interface
export interface UserProfile {
  id: string;
  name: string | null;
  pulse_id: string | null;
  email: string | null;
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
          console.log("useUserProfile: No user ID available for profile fetch");
          setLoading(false);
          return;
        }

        console.log("useUserProfile: Fetching profile for user ID:", user.id);

        // Try to fetch the profile with a shorter retry mechanism
        let attempts = 0;
        const maxAttempts = 3;
        let profileData = null;

        while (attempts < maxAttempts && !profileData) {
          const { data, error: profileError } = await supabase
            .from('users')
            .select('id, name, pulse_id, email')
            .eq('id', user.id)
            .maybeSingle();

          if (profileError) {
            console.error("useUserProfile: Profile fetch error:", profileError);
            setError(profileError.message);
            break;
          }

          if (data) {
            profileData = data;
            break;
          }

          // If no data found and this is not the last attempt, wait and retry
          if (attempts < maxAttempts - 1) {
            console.log(`useUserProfile: Profile not found, retrying in 1 second... (attempt ${attempts + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

          attempts++;
        }

        if (profileData) {
          console.log("useUserProfile: Profile data received:", profileData);
          const userProfile: UserProfile = {
            id: profileData.id,
            name: profileData.name ?? user.user_metadata?.full_name ?? null,
            pulse_id: profileData.pulse_id ?? user.user_metadata?.pulse_id ?? null,
            email: profileData.email ?? user.email ?? null,
          };
          setProfile(userProfile);
        } else {
          console.log("useUserProfile: No profile data found after retries, creating fallback from auth metadata");
          // Create a fallback profile from auth metadata if database profile doesn't exist yet
          const userProfile: UserProfile = {
            id: user.id,
            name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? null,
            pulse_id: user.user_metadata?.pulse_id ?? null,
            email: user.email ?? null,
          };
          setProfile(userProfile);
          
          // The trigger should have created the profile, but if it didn't, log it for debugging
          console.warn("useUserProfile: Using fallback profile - database trigger may not have completed yet");
        }
      } catch (err: any) {
        console.error("useUserProfile: Unexpected profile fetch error:", err);
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
