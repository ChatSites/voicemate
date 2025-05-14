
import React from 'react';
import PulseStatsCard from './PulseStatsCard';
import SendPulseCard from './SendPulseCard';
import InboxCard from './InboxCard';
import RecentActivityCard from './RecentActivityCard';

const DashboardCards: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PulseStatsCard />
        <SendPulseCard />
        <InboxCard />
      </div>
      <RecentActivityCard />
    </>
  );
};

export default DashboardCards;
