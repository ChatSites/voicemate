
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Using @ alias instead of relative path
import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  id: string;
  name: string | null;
  pulse_id: string | null;
  created_at?: string; // ✅ Added as optional property
  avatar_url?: string | null; // ✅ Added as optional property
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
          .from('users')
          .select('id, name, pulse_id, created_at, avatar_url')
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
