
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { UserData } from '@/hooks/useUserData';

interface UserStatusBadgeProps {
  user: UserData;
}

const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ user }) => {
  if (!user.profile_exists) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Missing Profile
      </Badge>
    );
  }
  
  if (!user.email_confirmed_at) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Unconfirmed Email
      </Badge>
    );
  }
  
  return (
    <Badge variant="default" className="flex items-center gap-1 bg-green-600">
      <CheckCircle className="w-3 h-3" />
      Complete
    </Badge>
  );
};

export default UserStatusBadge;
