
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, User, Shield } from 'lucide-react';

interface UserTableHeaderProps {
  userCount: number;
  onRefresh: () => void;
  refreshing: boolean;
}

const UserTableHeader: React.FC<UserTableHeaderProps> = ({ 
  userCount, 
  onRefresh, 
  refreshing 
}) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <User className="w-5 h-5" />
        User Management ({userCount} users)
        <Shield className="w-4 h-4 text-green-600" />
      </CardTitle>
      <Button 
        onClick={onRefresh} 
        disabled={refreshing}
        variant="outline"
        size="sm"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};

export default UserTableHeader;
