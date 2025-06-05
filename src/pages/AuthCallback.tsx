
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ErrorState from '@/components/ui/error-state';
import LoadingState from '@/components/ui/loading-state';

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
        // Handle code-based authentication
        const code = searchParams.get("code") || 
                     new URLSearchParams(location.hash.substring(1)).get("code");
        
        let session;
        let sessionError;
        
        // If we have a code parameter, try to exchange it for a session
        if (code) {
          console.log("Processing auth code:", code);
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          session = data.session;
          sessionError = error;
        } 
        // Handle hash-based authentication (magic links)
        else if (location.hash) {
          const hashParams = new URLSearchParams(location.hash.substring(1));
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");
          
          if (accessToken) {
            console.log("Processing magic link tokens");
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || "",
            });
            session = data.session;
            sessionError = error;
          }
        }
        
        // If no tokens found, check existing session
        if (!session && !sessionError) {
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

        console.log("Auth callback successful. Session:", session ? 'established' : 'none');
        
        // Get the type parameter to determine what kind of auth flow this is
        const type = searchParams.get("type") || 
                     new URLSearchParams(location.hash.substring(1)).get("type");
        
        switch (type) {
          case "signup":
            setMessage("Account confirmed! Redirecting to registration success...");
            toast({
              title: "Registration Successful",
              description: "Your account has been created and verified successfully."
            });
            setTimeout(() => navigate("/registration-success"), 1500);
            break;
            
          case "magiclink":
            setMessage("Login successful! Redirecting to dashboard...");
            toast({
              title: "Login Successful",
              description: "Welcome back to VoiceMate!"
            });
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
            
          case "invite":
            setMessage("Welcome to VoiceMate! Redirecting to dashboard...");
            toast({
              title: "Welcome!",
              description: "Your invitation has been accepted successfully."
            });
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
            
          case "recovery":
            setMessage("Please reset your password.");
            setTimeout(() => {
              if (location.hash) {
                navigate(`/update-password${location.hash}`);
              } else {
                navigate("/update-password");
              }
            }, 1500);
            break;
            
          case "email_change":
            setMessage("Email updated successfully! Redirecting to dashboard...");
            toast({
              title: "Email Updated",
              description: "Your email has been updated successfully."
            });
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
            
          default:
            // Default behavior - check if we have a session to determine redirect
            if (session) {
              setMessage("Authentication complete. Redirecting to dashboard...");
              toast({
                title: "Login Successful",
                description: "Welcome to VoiceMate!"
              });
              setTimeout(() => navigate("/dashboard"), 1500);
            } else {
              setMessage("Authentication required. Redirecting to login...");
              setTimeout(() => navigate("/auth"), 1500);
            }
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

  const handleRetry = () => {
    setError(null);
    setIsProcessing(true);
    setMessage("Retrying authentication...");
    window.location.reload();
  };

  if (error) {
    return (
      <ErrorState
        fullScreen
        title="Authentication Error"
        message={error}
        onRetry={handleRetry}
        showRetry={true}
      />
    );
  }

  if (isProcessing) {
    return (
      <LoadingState
        fullScreen
        message={message}
        size="lg"
      />
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
            <CardTitle className="text-xl text-center">Authentication</CardTitle>
            <CardDescription className="text-center">Complete</CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center py-6">
            <div className="text-center">
              <div className="rounded-full bg-green-900/20 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg text-green-400 mb-2">Success</p>
              <p className="text-gray-300 mb-6">{message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
