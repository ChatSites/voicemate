
import React from 'react';
import { UserData } from '@/hooks/useUserData';

interface UserTableSummaryProps {
  users: UserData[];
}

const UserTableSummary: React.FC<UserTableSummaryProps> = ({ users }) => {
  const completeProfiles = users.filter(u => u.profile_exists && u.email_confirmed_at).length;
  const issuesDetected = users.filter(u => !u.profile_exists || !u.email_confirmed_at).length;

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-muted/20 p-4 rounded-lg">
        <div className="text-sm text-muted-foreground">Total Registrations</div>
        <div className="text-2xl font-bold">{users.length}</div>
      </div>
      <div className="bg-green-500/10 p-4 rounded-lg">
        <div className="text-sm text-muted-foreground">Complete Profiles</div>
        <div className="text-2xl font-bold text-green-600">{completeProfiles}</div>
      </div>
      <div className="bg-red-500/10 p-4 rounded-lg">
        <div className="text-sm text-muted-foreground">Issues Detected</div>
        <div className="text-2xl font-bold text-red-600">{issuesDetected}</div>
      </div>
    </div>
  );
};

export default UserTableSummary;
