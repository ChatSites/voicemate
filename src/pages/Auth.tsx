
import React, { useState, useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from '@/components/auth/LoginForm';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [showResetForm, setShowResetForm] = useState(false);
  const [activeTab, setActiveTab] = useState('register');
  const [prefilledPulseId, setPrefilledPulseId] = useState('');
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const tab = params.get('tab');
      const pulseId = params.get('pulseId');

      if (tab === 'login') setActiveTab('login');
      if (pulseId) setPrefilledPulseId(pulseId);

      // Initial auth check
      const checkSession = async () => {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            navigate('/');
          }
        } catch (err) {
          console.error('Error checking session:', err);
          setError('Failed to verify authentication. Please try again.');
        } finally {
          setInitialCheckDone(true);
        }
      };

      checkSession();
    } catch (err) {
      console.error('Error in Auth component setup:', err);
      setError('An unexpected error occurred. Please refresh the page.');
      setInitialCheckDone(true);
    }
  }, [navigate, location.search]);

  // Effect to redirect if user is authenticated
  useEffect(() => {
    if (initialCheckDone && !authLoading && user) {
      console.log('User is authenticated, redirecting to home');
      navigate('/');
    }
  }, [user, authLoading, navigate, initialCheckDone]);

  const switchToLogin = () => {
    setActiveTab('login');
    setShowResetForm(false);
  };

  const switchToRegister = () => {
    setActiveTab('register');
  };

  if (authLoading || !initialCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-voicemate-purple" />
          <p className="text-gray-300">Checking authentication state...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
        <Card className="border border-gray-800 bg-voicemate-card/60 backdrop-blur-md max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-xl text-center">Authentication Error</CardTitle>
            <CardDescription className="text-center text-red-400">
              {error}
            </CardDescription>
          </CardHeader>
          <div className="p-6 text-center">
            <Button 
              onClick={() => window.location.reload()}
              className="bg-voicemate-purple hover:bg-voicemate-purple/90"
            >
              Refresh Page
            </Button>
          </div>
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
          <CardHeader>
            <CardTitle className="text-xl text-center">Welcome to VoiceMate</CardTitle>
            <CardDescription className="text-center">
              {activeTab === 'register' ? 'Claim your PulseID' : 'Login to your account'}
            </CardDescription>
          </CardHeader>

          {activeTab === 'register' ? (
            <>
              <RegisterForm prefilledPulseId={prefilledPulseId} onSwitchToLogin={switchToLogin} />
              <div className="px-6 pb-6 text-center">
                <p className="text-sm text-gray-400 mt-4">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-voicemate-purple hover:text-voicemate-red"
                    onClick={switchToLogin}
                  >
                    Sign in here
                  </Button>
                </p>
              </div>
            </>
          ) : !showResetForm ? (
            <>
              <LoginForm onShowResetForm={() => setShowResetForm(true)} />
              <div className="px-6 pb-6 text-center">
                <p className="text-sm text-gray-400 mt-4">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-voicemate-purple hover:text-voicemate-red"
                    onClick={switchToRegister}
                  >
                    Claim your PulseID
                  </Button>
                </p>
              </div>
            </>
          ) : (
            <PasswordResetForm onGoBack={() => setShowResetForm(false)} />
          )}
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <a href="/" className="text-voicemate-purple hover:text-voicemate-red transition-colors">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
