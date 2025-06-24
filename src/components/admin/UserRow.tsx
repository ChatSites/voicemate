
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { UserData } from '@/hooks/useUserData';
import UserStatusBadge from './UserStatusBadge';

interface UserRowProps {
  user: UserData;
}

const UserRow: React.FC<UserRowProps> = ({ user }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <TableRow>
      <TableCell>
        <UserStatusBadge user={user} />
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
  );
};

export default UserRow;
