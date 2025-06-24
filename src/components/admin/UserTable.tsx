
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { RefreshCw, Shield } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import UserTableHeader from './UserTableHeader';
import UserTableBody from './UserTableBody';
import UserTableSummary from './UserTableSummary';

const UserTable: React.FC = () => {
  const { users, loading, refreshing, fetchUsers } = useUserData();

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
        <UserTableHeader 
          userCount={users.length}
          onRefresh={fetchUsers}
          refreshing={refreshing}
        />
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <Shield className="w-4 h-4" />
            <span>This interface is now protected by Row Level Security (RLS). Admin privileges are required for full access.</span>
          </div>
        </div>
        
        <UserTableBody users={users} />
        
        {users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        )}
        
        <UserTableSummary users={users} />
      </CardContent>
    </Card>
  );
};

export default UserTable;
