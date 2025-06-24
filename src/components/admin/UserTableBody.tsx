
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserData } from '@/hooks/useUserData';
import UserRow from './UserRow';

interface UserTableBodyProps {
  users: UserData[];
}

const UserTableBody: React.FC<UserTableBodyProps> = ({ users }) => {
  return (
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
          <UserRow key={user.id} user={user} />
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTableBody;
