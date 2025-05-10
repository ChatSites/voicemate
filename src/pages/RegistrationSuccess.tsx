
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CircleCheck } from 'lucide-react';

const RegistrationSuccess = () => {
  const navigate = useNavigate();

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
              Thank you for joining VoiceMate. Your account has been created.
            </p>
            
            <Button 
              className="w-full bg-voicemate-purple hover:bg-purple-700"
              onClick={() => navigate('/')}
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
