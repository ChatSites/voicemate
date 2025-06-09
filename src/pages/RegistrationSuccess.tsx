
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Mail, Loader2, Home, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = useUserProfile();
  const [countdown, setCountdown] = useState(10);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    document.title = 'Registration Successful | VoiceMate';
  }, []);

  // Debug: Check user and profile information
  useEffect(() => {
    if (user) {
      console.log('RegistrationSuccess: User data:', {
        id: user.id,
        email: user.email,
        confirmed_at: user.email_confirmed_at,
        metadata: user.user_metadata
      });
      
      setDebugInfo({
        userId: user.id,
        email: user.email,
        confirmed: !!user.email_confirmed_at,
        metadata: user.user_metadata
      });
    }
  }, [user]);

  // Redirect countdown
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToAuth = () => {
    navigate('/auth');
  };

  const handleCheckProfile = async () => {
    if (user) {
      console.log('Manually checking profile for user:', user.id);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      console.log('Manual profile check result:', { data, error });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
        <Card className="border border-gray-800 bg-voicemate-card/60 backdrop-blur-md max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-300">You need to be logged in to view this page.</p>
            <Button onClick={handleGoToAuth} className="bg-voicemate-purple hover:bg-voicemate-purple/90">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-white inline-block bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">
            VoiceMate
          </a>
        </div>

        <Card className="border border-gray-800 bg-voicemate-card/60 backdrop-blur-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-500">Registration Successful!</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-gray-300">
                Welcome to VoiceMate! Your account has been created successfully.
              </p>
              
              {profileLoading ? (
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Setting up your profile...</span>
                </div>
              ) : profile ? (
                <div className="bg-voicemate-purple/10 border border-voicemate-purple/30 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-300">Your Profile:</p>
                  <div className="space-y-1">
                    <p className="font-medium text-white">{profile.name}</p>
                    <p className="text-sm text-voicemate-purple">@{profile.pulse_id}</p>
                    <p className="text-sm text-gray-400">{profile.email}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-yellow-500">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Profile not created yet</span>
                  </div>
                  {profileError && (
                    <p className="text-xs text-red-400">Error: {profileError}</p>
                  )}
                  <Button 
                    onClick={handleCheckProfile}
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                  >
                    Check Profile Again
                  </Button>
                </div>
              )}

              {!user.email_confirmed_at && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 text-blue-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Please check your email for verification</span>
                  </div>
                </div>
              )}
            </div>

            {/* Debug information */}
            {debugInfo && (
              <div className="bg-gray-800/50 rounded-lg p-3 text-left">
                <p className="text-xs text-gray-400 mb-2">Debug Info:</p>
                <div className="text-xs space-y-1">
                  <p>User ID: {debugInfo.userId}</p>
                  <p>Email: {debugInfo.email}</p>
                  <p>Confirmed: {debugInfo.confirmed ? 'Yes' : 'No'}</p>
                  <p>PulseID: {debugInfo.metadata?.pulse_id || 'Not set'}</p>
                </div>
              </div>
            )}

            <div className="border-t border-gray-700 pt-6 space-y-4">
              <p className="text-sm text-gray-400">
                You'll be redirected to the home page in {countdown} seconds.
              </p>
              
              <Button 
                onClick={handleGoHome}
                className="w-full bg-voicemate-purple hover:bg-voicemate-purple/90"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Home Page
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Ready to start your VoiceMate journey!</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
