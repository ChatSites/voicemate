
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CircleCheck, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  // Redirect authenticated users directly to dashboard
  useEffect(() => {
    if (!loading) {
      // If user is authenticated, navigate to dashboard after short delay
      if (user) {
        const timer = setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [loading, navigate, user]);

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
              Your PulseID has been claimed successfully
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center">
            <Alert className="mb-4 border-blue-500/20 bg-blue-500/10">
              <Mail className="h-5 w-5 text-blue-500" />
              <AlertDescription className="text-sm">
                Check your email inbox for a verification link to complete your registration.
              </AlertDescription>
            </Alert>
            
            <p className="text-center mb-6 text-gray-400">
              After verifying your email, you'll be able to access all features of VoiceMate.
            </p>
            
            <Button 
              className="w-full bg-voicemate-purple hover:bg-purple-700"
              onClick={handleGoToDashboard}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
