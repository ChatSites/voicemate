
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, User, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UserData {
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

const UserTable: React.FC = () => {
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (user: UserData) => {
    if (!user.profile_exists) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Missing Profile
      </Badge>;
    }
    if (!user.email_confirmed_at) {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Unconfirmed Email
      </Badge>;
    }
    return <Badge variant="default" className="flex items-center gap-1 bg-green-600">
      <CheckCircle className="w-3 h-3" />
      Complete
    </Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Loading users...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Management ({users.length} users)
            <Shield className="w-4 h-4 text-green-600" title="RLS Protected" />
          </CardTitle>
          <Button 
            onClick={fetchUsers} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <Shield className="w-4 h-4" />
            <span>This interface is now protected by Row Level Security (RLS). Admin privileges are required for full access.</span>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Pulse ID</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Email Confirmed</TableHead>
              <TableHead>Profile Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {getStatusBadge(user)}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {user.email}
                </TableCell>
                <TableCell>
                  {user.profile_name || user.full_name || '-'}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {user.profile_pulse_id || user.pulse_id || '-'}
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(user.auth_created_at)}
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(user.email_confirmed_at)}
                </TableCell>
                <TableCell className="text-sm">
                  {user.profile_exists ? formatDate(user.profile_created_at) : 'Missing'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        )}
        
        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Registrations</div>
            <div className="text-2xl font-bold">{users.length}</div>
          </div>
          <div className="bg-green-500/10 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Complete Profiles</div>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.profile_exists && u.email_confirmed_at).length}
            </div>
          </div>
          <div className="bg-red-500/10 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Issues Detected</div>
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => !u.profile_exists || !u.email_confirmed_at).length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserTable;
