
import React, { useState, useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from '@/components/auth/LoginForm';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showResetForm, setShowResetForm] = useState(false);
  const [activeTab, setActiveTab] = useState('register');
  const [prefilledPulseId, setPrefilledPulseId] = useState('');
  
  useEffect(() => {
    // Get query parameters
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const pulseId = params.get('pulseId');
    
    // Set default tab if specified in URL
    if (tab === 'login') {
      setActiveTab('login');
    }
    
    // Set prefilled PulseID if specified in URL
    if (pulseId) {
      setPrefilledPulseId(pulseId);
    }
    
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate, location.search]);

  const switchToLogin = () => {
    setActiveTab('login');
    setShowResetForm(false);
  };

  const switchToRegister = () => {
    setActiveTab('register');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-white inline-block bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate</a>
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
              <RegisterForm prefilledPulseId={prefilledPulseId} />
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
          ) : (
            <>
              {!showResetForm ? (
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
            </>
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
