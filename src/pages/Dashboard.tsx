
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardCards from '@/components/dashboard/DashboardCards';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import DashboardError from '@/components/dashboard/DashboardError';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = useUserProfile();
  const navigate = useNavigate();

  // Add debugging information
  useEffect(() => {
    console.log("Dashboard render - Auth loading:", authLoading);
    console.log("Dashboard render - User:", user);
    console.log("Dashboard render - Profile loading:", profileLoading);
    console.log("Dashboard render - Profile:", profile);
    console.log("Dashboard render - Profile error:", profileError);
  }, [authLoading, user, profileLoading, profile, profileError]);

  // Redirect to auth page if not authenticated and not still loading
  useEffect(() => {
    if (!authLoading && !user) {
      console.log("No authenticated user found, redirecting to auth page");
      toast({
        title: "Authentication required",
        description: "Please sign in to access the dashboard",
        variant: "destructive"
      });
      navigate('/auth');
    } else if (user) {
      console.log("Authenticated user found:", user.email);
    }
  }, [authLoading, user, navigate]);

  // Show loading state while authentication is being checked
  if (authLoading) {
    return <DashboardLoading message="Checking authentication..." />;
  }

  // If no user is authenticated, this will trigger the redirect in useEffect
  // But we return an empty div to prevent flash of content
  if (!user) {
    return <div className="min-h-screen bg-black"></div>;
  }

  // Show loading state for profile separately
  if (profileLoading) {
    return <DashboardLoading message="Loading your profile data..." />;
  }

  // Handle profile error
  if (profileError) {
    console.error("Failed to load profile:", profileError);
    return <DashboardError message="There was a problem loading your profile data." />;
  }

  // Default value for username in case profile data is incomplete
  const displayName = profile?.name || user.email?.split('@')[0] || 'User';
  const displayPulseId = profile?.pulse_id || 'loading...';

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
