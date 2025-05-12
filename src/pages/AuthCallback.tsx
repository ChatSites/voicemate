import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [message, setMessage] = useState("Completing authentication...");
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    document.title = 'Authentication | VoiceMate ID';
    
    const handleAuthRedirect = async () => {
      try {
        // Fix: Use exchangeCodeForSession instead of the deprecated getSessionFromUrl
        const code = searchParams.get("code") || 
                     new URLSearchParams(location.hash.substring(1)).get("code");
        
        let session;
        let sessionError;
        
        // If we have a code parameter, try to exchange it for a session
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          session = data.session;
          sessionError = error;
        } else {
          // For older flows or auth state changes
          const { data, error } = await supabase.auth.getSession();
          session = data.session;
          sessionError = error;
        }

        if (sessionError) {
          console.error("Auth error:", sessionError.message);
          setMessage("There was a problem with authentication.");
          setError(sessionError.message);
          setIsProcessing(false);
          return;
        }

        console.log("Auth callback successful:", session);
        
        // Get the type parameter to determine what kind of auth flow this is
        const type = searchParams.get("type");
        
        switch (type) {
          case "signup":
            setMessage("Account confirmed! Redirecting you to the dashboard...");
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
            
          case "magiclink":
            setMessage("Login successful! Redirecting...");
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
            
          case "invite":
            setMessage("Welcome to VoiceMate! Redirecting...");
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
            
          case "recovery":
            setMessage("Please reset your password.");
            setTimeout(() => navigate("/update-password"), 1500);
            break;
            
          case "email_change":
            setMessage("Email updated successfully! Redirecting...");
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
            
          default:
            setMessage("Authentication complete. Redirecting...");
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
        }
        
        setIsProcessing(false);
      } catch (err: any) {
        console.error("Error processing auth callback:", err);
        setMessage("Authentication process failed.");
        setError(err.message || "Unknown error occurred");
        setIsProcessing(false);
      }
    };

    handleAuthRedirect();
  }, [navigate, searchParams, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-white inline-block bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate</a>
        </div>
        
        <Card className="border border-gray-800 bg-voicemate-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-center">Authentication</CardTitle>
            <CardDescription className="text-center">
              {isProcessing ? 'Processing...' : error ? 'Error' : 'Complete'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center py-6">
            {isProcessing ? (
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-voicemate-purple" />
                <p className="text-lg">{message}</p>
                <p className="text-sm text-gray-400 mt-2">Please wait...</p>
              </div>
            ) : error ? (
              <div className="text-center">
                <div className="rounded-full bg-red-900/20 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-lg text-red-400 mb-2">Authentication Error</p>
                <p className="text-sm text-gray-300 mb-6">{error}</p>
                <Button 
                  onClick={() => navigate("/auth")}
                  className="bg-voicemate-purple hover:bg-purple-700"
                >
                  Return to Login
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="rounded-full bg-green-900/20 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-lg text-green-400 mb-2">Success</p>
                <p className="text-gray-300 mb-6">{message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
