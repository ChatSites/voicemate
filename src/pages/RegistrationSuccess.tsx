
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CircleCheck, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      console.log('RegistrationSuccess: Checking authentication status...');
      
      // Wait a moment for auth state to settle
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsChecking(false);
    };

    checkStatus();
  }, []);

  // Auto-redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && !isChecking && user) {
      console.log('User is authenticated, redirecting to dashboard...');
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
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
          <p className="text-gray-400">Checking your registration status...</p>
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
            <CardTitle className="text-xl text-center">
              {user ? "Registration Complete!" : "Registration Successful!"}
            </CardTitle>
            <CardDescription className="text-center">
              {user 
                ? "You're all set! Redirecting to your dashboard..."
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
                    ✓ You're signed in and ready to use VoiceMate!
                  </AlertDescription>
                </Alert>
                
                <p className="text-center mb-4 text-gray-400">
                  You'll be automatically redirected to your dashboard in a moment.
                </p>
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
                  After verifying your email, you'll be able to access all features of VoiceMate.
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
