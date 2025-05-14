
import React from 'react';
import Navbar from '@/components/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardCards from '@/components/dashboard/DashboardCards';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import DashboardError from '@/components/dashboard/DashboardError';
import { useDashboardAuth } from '@/hooks/useDashboardAuth';

export default function Dashboard() {
  const {
    isAuthenticated,
    isLoading,
    isProfileLoading,
    hasProfileError,
    profileErrorMessage,
    displayName,
    displayPulseId
  } = useDashboardAuth();

  // Display logging for debugging
  console.log('Dashboard component - Auth loading:', isLoading);
  console.log('Dashboard component - isAuthenticated:', isAuthenticated);
  console.log('Dashboard component - Profile loading:', isProfileLoading);
  console.log('Dashboard component - Has profile error:', hasProfileError);
  console.log('Dashboard component - Display name:', displayName);
  console.log('Dashboard component - Display pulse ID:', displayPulseId);

  // Show loading state while authentication is being checked
  if (isLoading) {
    return <DashboardLoading message="Checking authentication..." />;
  }

  // If no user is authenticated, this will trigger the redirect in the hook
  // But we return an empty div to prevent flash of content
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-black"></div>;
  }

  // Show loading state for profile separately
  if (isProfileLoading) {
    return <DashboardLoading message="Loading your profile data..." />;
  }

  // Handle profile error
  if (hasProfileError) {
    return <DashboardError message={profileErrorMessage || "Unknown error"} />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <DashboardHeader displayName={displayName} displayPulseId={displayPulseId} />
        <DashboardCards />
      </div>
    </div>
  );
}
