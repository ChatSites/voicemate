
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CircleCheck, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const { user, loading, refreshSession } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [profileCreated, setProfileCreated] = useState(false);

  // Check authentication status and profile creation
  useEffect(() => {
    const checkStatus = async () => {
      console.log('RegistrationSuccess: Checking authentication status...');
      
      // Wait for auth to settle
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Try to refresh session to get latest state
      if (!loading) {
        await refreshSession();
      }
      
      setIsChecking(false);
    };

    checkStatus();
  }, [loading, refreshSession]);

  // Auto-redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && !isChecking && user) {
      console.log('User is authenticated, redirecting to dashboard...');
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, isChecking, user, navigate]);

  // Handle navigation
  const handleContinue = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  // Show loading state while checking
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
          <p className="text-gray-400">Setting up your account...</p>
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
              {user ? (
                <CircleCheck className="h-16 w-16 text-green-500" />
              ) : (
                <Mail className="h-16 w-16 text-blue-500" />
              )}
            </div>
            <CardTitle className="text-xl text-center">
              {user ? "Welcome to VoiceMate!" : "Check Your Email"}
            </CardTitle>
            <CardDescription className="text-center">
              {user 
                ? "Your account has been created successfully"
                : "Please verify your email to complete registration"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center">
            {user ? (
              <div className="text-center mb-6 w-full">
                <Alert className="mb-4 border-green-500/20 bg-green-500/10">
                  <CircleCheck className="h-5 w-5 text-green-500" />
                  <AlertDescription className="text-sm text-green-400">
                    Account created successfully! Redirecting to dashboard...
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="text-center mb-6 w-full">
                <Alert className="mb-4 border-blue-500/20 bg-blue-500/10">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <AlertDescription className="text-sm text-blue-400">
                    Check your email inbox for a verification link to complete your registration.
                  </AlertDescription>
                </Alert>
                
                <p className="text-center mb-4 text-gray-400">
                  After verifying your email, you'll be able to sign in and access all features.
                </p>
              </div>
            )}
            
            <Button 
              className="w-full bg-voicemate-purple hover:bg-purple-700"
              onClick={handleContinue}
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
