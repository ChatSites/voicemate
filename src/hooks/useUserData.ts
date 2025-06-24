
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface UserData {
  id: string;
  email: string;
  auth_created_at: string;
  email_confirmed_at: string | null;
  full_name: string | null;
  pulse_id: string | null;
  profile_exists: boolean;
  profile_created_at: string | null;
  profile_name: string | null;
  profile_pulse_id: string | null;
  profile_email: string | null;
}

export const useUserData = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      
      // Get all auth users with their metadata (requires admin privileges)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Auth admin error:", authError);
        throw new Error(`Admin access required: ${authError.message}`);
      }

      // Get all profile users (this now respects RLS - admin users should be able to see all)
      const { data: profileUsers, error: profileError } = await supabase
        .from('users')
        .select('*');

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        // Don't throw here - continue with limited data
        console.warn("Could not fetch profile data due to RLS restrictions. Admin privileges may be required.");
      }

      // Combine the data
      const combinedUsers: UserData[] = authUsers.users.map(authUser => {
        const profile = profileUsers?.find(p => p.id === authUser.id);
        
        return {
          id: authUser.id,
          email: authUser.email || '',
          auth_created_at: authUser.created_at,
          email_confirmed_at: authUser.email_confirmed_at,
          full_name: authUser.user_metadata?.full_name || null,
          pulse_id: authUser.user_metadata?.pulse_id || null,
          profile_exists: !!profile,
          profile_created_at: profile?.created_at || null,
          profile_name: profile?.name || null,
          profile_pulse_id: profile?.pulse_id || null,
          profile_email: profile?.email || null,
        };
      });

      // Sort by creation date (newest first)
      combinedUsers.sort((a, b) => new Date(b.auth_created_at).getTime() - new Date(a.auth_created_at).getTime());
      
      setUsers(combinedUsers);
      
      const issuesCount = combinedUsers.filter(u => !u.profile_exists || !u.email_confirmed_at).length;
      
      toast({
        title: "Users refreshed",
        description: `Found ${combinedUsers.length} total users${issuesCount > 0 ? `, ${issuesCount} with issues` : ''}`,
        ...(profileError && { 
          variant: "destructive" as const,
          description: "Limited data available due to security restrictions"
        })
      });
      
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, refreshing, fetchUsers };
};
