
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
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);

  // Check authentication status and determine if email confirmation is needed
  useEffect(() => {
    const checkStatus = async () => {
      console.log('RegistrationSuccess: Checking authentication status...');
      
      // Wait for auth to settle
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Try to refresh session to get latest state
      if (!loading) {
        await refreshSession();
      }
      
      // If still no user after refresh, likely needs email confirmation
      if (!user && !loading) {
        console.log('RegistrationSuccess: No authenticated user found, email confirmation likely required');
        setEmailConfirmationRequired(true);
      }
      
      setIsChecking(false);
    };

    checkStatus();
  }, [loading, refreshSession, user]);

  // Auto-redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && !isChecking && user) {
      console.log('RegistrationSuccess: User is authenticated, redirecting to dashboard...');
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
              {user ? "Welcome to VoiceMate!" : "Registration Successful!"}
            </CardTitle>
            <CardDescription className="text-center">
              {user 
                ? "Your account has been created and is ready to use"
                : "Please check your email to verify your account"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center">
            {user ? (
              <div className="text-center mb-6 w-full">
                <Alert className="mb-4 border-green-500/20 bg-green-500/10">
                  <CircleCheck className="h-5 w-5 text-green-500" />
                  <AlertDescription className="text-sm text-green-400">
                    Account verified and ready! Redirecting to dashboard...
                  </AlertDescription>
                </Alert>
              </div>
            ) : emailConfirmationRequired ? (
              <div className="text-center mb-6 w-full">
                <Alert className="mb-4 border-blue-500/20 bg-blue-500/10">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <AlertDescription className="text-sm text-blue-400">
                    Registration successful! Check your email for a verification link to complete setup.
                  </AlertDescription>
                </Alert>
                
                <div className="text-sm text-gray-400 mb-4">
                  <p className="mb-2">• Check your email inbox (and spam folder)</p>
                  <p className="mb-2">• Click the verification link in the email</p>
                  <p>• Return here to sign in after verification</p>
                </div>
              </div>
            ) : (
              <div className="text-center mb-6 w-full">
                <Alert className="mb-4 border-yellow-500/20 bg-yellow-500/10">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <AlertDescription className="text-sm text-yellow-400">
                    Registration in progress. If you don't receive an email within a few minutes, try signing in directly.
                  </AlertDescription>
                </Alert>
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
