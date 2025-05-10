
import React, { useState, useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from '@/components/auth/LoginForm';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showResetForm, setShowResetForm] = useState(false);
  const [defaultTab, setDefaultTab] = useState('login');
  const [prefilledPulseId, setPrefilledPulseId] = useState('');
  
  useEffect(() => {
    // Get query parameters
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const pulseId = params.get('pulseId');
    
    // Set default tab if specified in URL
    if (tab === 'register') {
      setDefaultTab('register');
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
            <CardDescription className="text-center">Login or claim your PulseID</CardDescription>
          </CardHeader>
          
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 bg-black/20">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Claim ID</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              {!showResetForm ? (
                <LoginForm onShowResetForm={() => setShowResetForm(true)} />
              ) : (
                <PasswordResetForm onGoBack={() => setShowResetForm(false)} />
              )}
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm prefilledPulseId={prefilledPulseId} />
            </TabsContent>
          </Tabs>
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
