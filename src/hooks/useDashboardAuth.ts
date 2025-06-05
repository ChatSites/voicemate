import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from "@/hooks/use-toast";

export interface DashboardAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isProfileLoading: boolean;
  hasProfileError: boolean;
  profileErrorMessage: string | null;
  displayName: string;
  displayPulseId: string;
}

export const useDashboardAuth = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = useUserProfile();
  const navigate = useNavigate();
  const [state, setState] = useState<DashboardAuthState>({
    isAuthenticated: false,
    isLoading: true,
    isProfileLoading: true,
    hasProfileError: false,
    profileErrorMessage: null,
    displayName: '',
    displayPulseId: ''
  });

  // Add debugging information
  useEffect(() => {
    console.log("Dashboard auth hook - Auth loading:", authLoading);
    console.log("Dashboard auth hook - User:", user ? 'authenticated' : 'not authenticated');
    console.log("Dashboard auth hook - Profile loading:", profileLoading);
    console.log("Dashboard auth hook - Profile:", profile);
    console.log("Dashboard auth hook - Profile error:", profileError);
  }, [authLoading, user, profileLoading, profile, profileError]);

  // Redirect to auth page if not authenticated and not still loading
  useEffect(() => {
    if (!authLoading && !user) {
      console.log("No authenticated user found, redirecting to auth page");
      
      try {
        // Show toast notification only if we're in the browser environment
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            try {
              toast({
                title: "Authentication required",
                description: "Please sign in to access the dashboard",
                variant: "destructive"
              });
            } catch (err) {
              console.error("Failed to show toast notification:", err);
            }
          }, 0);
        }
      } catch (err) {
        console.error("Failed in toast attempt:", err);
      }
      
      // Ensure the redirect happens even if toast fails
      // Use setTimeout to avoid potential race conditions
      setTimeout(() => {
        try {
          navigate('/auth');
        } catch (navErr) {
          console.error("Navigation error:", navErr);
          // Fallback if navigation fails
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }
        }
      }, 200);
    } else if (user) {
      console.log("Authenticated user found:", user.email);
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        isLoading: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        isLoading: authLoading,
      }));
    }
  }, [authLoading, user, navigate]);

  // Handle profile loading and errors
  useEffect(() => {
    if (!user) return;

    if (profileError) {
      console.error("Failed to load profile:", profileError);
      setState(prev => ({
        ...prev,
        isProfileLoading: false,
        hasProfileError: true,
        profileErrorMessage: "There was a problem loading your profile data."
      }));
      return;
    }

    if (!profileLoading && profile) {
      // Default value for username in case profile data is incomplete
      const displayName = profile.name || user.email?.split('@')[0] || 'User';
      const displayPulseId = profile.pulse_id || 'loading...';

      setState(prev => ({
        ...prev,
        isProfileLoading: false,
        hasProfileError: false,
        profileErrorMessage: null,
        displayName,
        displayPulseId
      }));
    } else {
      setState(prev => ({
        ...prev,
        isProfileLoading: profileLoading
      }));
    }
  }, [user, profile, profileLoading, profileError]);

  return state;
};
