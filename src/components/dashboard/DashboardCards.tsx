
import React, { lazy } from 'react';
import LazyDashboardCard from './LazyDashboardCard';

// Lazy load dashboard card components
const PulseStatsCard = lazy(() => import('./PulseStatsCard'));
const SendPulseCard = lazy(() => import('./SendPulseCard'));
const InboxCard = lazy(() => import('./InboxCard'));
const RecentActivityCard = lazy(() => import('./RecentActivityCard'));

const DashboardCards: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LazyDashboardCard>
          <PulseStatsCard />
        </LazyDashboardCard>
        <LazyDashboardCard>
          <SendPulseCard />
        </LazyDashboardCard>
        <LazyDashboardCard>
          <InboxCard />
        </LazyDashboardCard>
      </div>
      <LazyDashboardCard className="mt-12">
        <RecentActivityCard />
      </LazyDashboardCard>
    </>
  );
};

export default DashboardCards;
