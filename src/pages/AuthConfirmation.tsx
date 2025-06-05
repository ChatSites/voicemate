import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const AuthConfirmation = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');
  const [actionType, setActionType] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    document.title = 'Confirm Account | VoiceMate ID';
    
    const processAuthAction = async () => {
      try {
        setLoading(true);
        
        // Get hash parameters or query parameters
        const hashParams = new URLSearchParams(location.hash.replace('#', ''));
        const queryParams = new URLSearchParams(location.search);
        
        // Try to extract relevant parameters, checking both hash and query
        const type = hashParams.get('type') || queryParams.get('type');
        const token = hashParams.get('access_token') || 
                      queryParams.get('access_token') ||
                      hashParams.get('token') || 
                      queryParams.get('token');
                      
        const error = hashParams.get('error') || queryParams.get('error');
        const errorDescription = hashParams.get('error_description') || 
                               queryParams.get('error_description');
        
        console.log('Auth confirmation parameters:', {
          type, token: !!token, error, errorDescription, 
          hash: location.hash, search: location.search
        });
        
        setActionType(type || 'unknown');
        
        // Handle errors first
        if (error) {
          setSuccess(false);
          setMessage(errorDescription || `Authentication error: ${error}`);
          return;
        }
        
        // Without a token, we can't proceed with verification
        if (!token) {
          setSuccess(false);
          setMessage('Invalid or missing authentication token.');
          return;
        }
        
        // Process based on action type
        if (type === 'signup' || type === 'email_change') {
          // Verify the email confirmation
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email',
          });
          
          if (verifyError) {
            throw verifyError;
          }
          
          setSuccess(true);
          setMessage(type === 'signup' ? 
            'Your email has been confirmed! You can now log in.' : 
            'Your email address has been updated successfully.');
          
        } else if (type === 'recovery' || type === 'invite') {
          // For password reset or invites, redirect to update password page
          navigate(`/update-password?access_token=${token}`);
          return;
          
        } else if (type === 'magiclink') {
          // For magic links, attempt to exchange token for session
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: '',
          });
          
          if (sessionError) {
            throw sessionError;
          }
          
          setSuccess(true);
          setMessage('You have been successfully signed in!');
          setTimeout(() => navigate('/'), 1500);
          return;
          
        } else {
          // Unknown action type
          setSuccess(false);
          setMessage(`Unsupported authentication action type: ${type || 'unknown'}`);
        }
      } catch (error: any) {
        console.error('Auth confirmation error:', error);
        setSuccess(false);
        setMessage(error?.message || 'An error occurred during authentication.');
        toast({
          title: "Authentication Error",
          description: error?.message || "Something went wrong with the authentication process.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    processAuthAction();
  }, [location.hash, location.search, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-white inline-block bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate</a>
        </div>
        
        <Card className="border border-gray-800 bg-voicemate-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {actionType === 'signup' ? 'Email Confirmation' : 
               actionType === 'recovery' ? 'Password Reset' : 
               actionType === 'magiclink' ? 'Magic Link' : 
               actionType === 'invite' ? 'Account Invitation' : 
               actionType === 'email_change' ? 'Email Change' : 
               'Authentication'}
            </CardTitle>
            <CardDescription className="text-center">
              {loading ? 'Processing your request...' : 
               success ? 'Success!' : 'Something went wrong'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center">
            {loading ? (
              <div className="flex flex-col items-center space-y-4 my-8">
                <Loader2 className="h-10 w-10 animate-spin text-voicemate-purple" />
                <p className="text-gray-400">Verifying your authentication...</p>
              </div>
            ) : success ? (
              <div className="flex flex-col items-center space-y-4 my-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="text-center mb-6">{message}</p>
                <Button 
                  className="w-full bg-voicemate-purple hover:bg-purple-700"
                  onClick={() => navigate('/auth')}
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4 my-4">
                <AlertCircle className="h-16 w-16 text-amber-500" />
                <p className="text-center mb-6 text-gray-300">{message}</p>
                <Button 
                  className="w-full bg-voicemate-purple hover:bg-purple-700"
                  onClick={() => navigate('/auth')}
                >
                  Back to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthConfirmation;
