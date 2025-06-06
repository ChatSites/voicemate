
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CircleCheck, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const { user, loading, refreshSession } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [profileStatus, setProfileStatus] = useState<'checking' | 'exists' | 'missing' | 'created'>('checking');

  // Check authentication status and profile on component mount
  useEffect(() => {
    const checkAuthAndProfile = async () => {
      console.log('RegistrationSuccess: Checking auth and profile status...');
      setIsChecking(true);
      
      // Wait a moment for auth state to settle
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try to refresh the session to get the latest state
      await refreshSession();
      
      setIsChecking(false);
    };

    checkAuthAndProfile();
  }, [refreshSession]);

  // Check for user profile when user is available
  useEffect(() => {
    const checkProfile = async () => {
      if (!user || loading || isChecking) return;
      
      console.log('Checking user profile for:', user.id);
      setProfileStatus('checking');
      
      try {
        const { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error checking profile:', error);
          setProfileStatus('missing');
          return;
        }
        
        if (profile) {
          console.log('Profile found:', profile);
          setProfileStatus('exists');
        } else {
          console.log('No profile found, attempting to create...');
          
          // Try to create profile using user metadata
          const fullName = user.user_metadata?.full_name || user.email?.split('@')[0];
          const pulseId = user.user_metadata?.pulse_id;
          
          if (pulseId) {
            const { data: newProfile, error: createError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                name: fullName,
                pulse_id: pulseId,
                email: user.email
              })
              .select()
              .single();
            
            if (createError) {
              console.error('Failed to create profile:', createError);
              setProfileStatus('missing');
            } else {
              console.log('Profile created successfully:', newProfile);
              setProfileStatus('created');
            }
          } else {
            setProfileStatus('missing');
          }
        }
      } catch (err) {
        console.error('Profile check error:', err);
        setProfileStatus('missing');
      }
    };

    checkProfile();
  }, [user, loading, isChecking]);

  // Handle dashboard navigation
  const handleGoToDashboard = () => {
    console.log('Dashboard button clicked - User:', user ? 'authenticated' : 'not authenticated');
    
    if (user) {
      // User is authenticated, go directly to dashboard
      navigate('/dashboard');
    } else {
      // User is not authenticated yet, redirect to auth page with a message
      console.log('User not authenticated, redirecting to auth page');
      navigate('/auth');
    }
  };

  // Auto-redirect authenticated users to dashboard after a delay
  useEffect(() => {
    if (!loading && !isChecking && user && profileStatus === 'exists') {
      console.log('User is authenticated with profile, will auto-navigate to dashboard in 3 seconds');
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, isChecking, user, profileStatus, navigate]);

  // Show loading state while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
        
        <div className="text-center">
          <div className="mb-6">
            <div className="text-2xl font-semibold text-white inline-block bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate</div>
          </div>
          
          <div className="flex justify-center mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-voicemate-purple" />
          </div>
          <p className="text-gray-400">Checking your authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-white inline-block bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate</a>
        </div>
        
        <Card className="border border-gray-800 bg-voicemate-card/60 backdrop-blur-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CircleCheck className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-xl text-center">Registration Successful!</CardTitle>
            <CardDescription className="text-center">
              {user ? "Your account has been created successfully" : "Please check your email to verify your account"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center">
            {user ? (
              <div className="text-center mb-6 w-full">
                <Alert className="mb-4 border-green-500/20 bg-green-500/10">
                  <CircleCheck className="h-5 w-5 text-green-500" />
                  <AlertDescription className="text-sm text-green-400">
                    ✓ You are now signed in and ready to use VoiceMate!
                  </AlertDescription>
                </Alert>
                
                {profileStatus === 'checking' && (
                  <div className="flex items-center justify-center mb-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-gray-400 text-sm">Setting up your profile...</span>
                  </div>
                )}
                
                {profileStatus === 'missing' && (
                  <Alert className="mb-4 border-amber-500/20 bg-amber-500/10">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <AlertDescription className="text-sm text-amber-400">
                      Profile setup incomplete. You can still access your dashboard.
                    </AlertDescription>
                  </Alert>
                )}
                
                {(profileStatus === 'exists' || profileStatus === 'created') && (
                  <p className="text-gray-400 text-sm">You'll be redirected to the dashboard automatically...</p>
                )}
              </div>
            ) : (
              <>
                <Alert className="mb-4 border-blue-500/20 bg-blue-500/10">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <AlertDescription className="text-sm">
                    Check your email inbox for a verification link to complete your registration.
                  </AlertDescription>
                </Alert>
                
                <p className="text-center mb-6 text-gray-400">
                  After verifying your email, you'll be able to access all features of VoiceMate.
                </p>
              </>
            )}
            
            <Button 
              className="w-full bg-voicemate-purple hover:bg-purple-700"
              onClick={handleGoToDashboard}
            >
              {user ? "Go to Dashboard" : "Continue to Sign In"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
