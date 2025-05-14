
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CircleCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Always direct to dashboard instead of auth
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  // Redirect authenticated users directly to dashboard
  useEffect(() => {
    if (!loading) {
      // If still loading, wait for auth state to resolve
      // If not loading (regardless of user state), proceed to dashboard after short delay
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Short delay to show success message
      
      return () => clearTimeout(timer);
    }
  }, [loading, navigate]);

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
            <p className="text-center mb-6 text-gray-400">
              Thank you for joining VoiceMate. You'll be redirected to the dashboard in a moment.
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
