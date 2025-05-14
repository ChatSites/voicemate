import { useEffect, useState } from 'react';
import { supabase } from '../../integrations/supabase/client'; // Use relative if alias breaks
import { useAuth } from '../../contexts/AuthContext';

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
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error: profileError } = await supabase
          .from<UserProfile>('users') // 👈 Fix is here
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          setError(profileError.message);
        } else if (data) {
          const userProfile: UserProfile = {
            id: data.id,
            name: user.user_metadata?.full_name ?? data.name ?? null,
            pulse_id: data.pulse_id ?? null,
            created_at: data.created_at ?? undefined,
            avatar_url: data.avatar_url ?? null,
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
