import React from 'react';
import SendPulseCard from './SendPulseCard';
import InboxCard from './InboxCard';
import ProfileCard from './ProfileCard';
import PulseStatsCard from './PulseStatsCard';
import RecentActivityCard from './RecentActivityCard';

const DashboardCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SendPulseCard />
      <InboxCard />
      <ProfileCard />
      <PulseStatsCard />
      <RecentActivityCard />
    </div>
  );
};

export default DashboardCards;
