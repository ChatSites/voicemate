
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const [message, setMessage] = useState("Completing authentication...");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        const code = searchParams.get("code") || 
                     new URLSearchParams(location.hash.substring(1)).get("code");
        
        // Get type from query parameters
        const type = searchParams.get("type");
        console.log("Auth callback type:", type);
        
        // Handle auth redirect with code
        if (code) {
          setMessage("Processing authentication...");
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error("Auth error:", error.message);
            setMessage("There was a problem confirming your account.");
            toast({
              title: "Authentication Error",
              description: error.message,
              variant: "destructive"
            });
            setTimeout(() => navigate('/auth'), 3000);
            return;
          }
          
          console.log("Auth flow completed successfully", data);
          
          if (data.session && data.user) {
            console.log("Session established for user:", data.user.email);
            setMessage("Authentication successful!");
            toast({
              title: "Authentication Successful",
              description: "Welcome to VoiceMate!"
            });
          }
        } 
        // Handle hash-based redirects (older format or magic links)
        else if (location.hash) {
          try {
            // Parse token from hash manually
            const hashParams = new URLSearchParams(location.hash.substring(1));
            const accessToken = hashParams.get("access_token");
            const refreshToken = hashParams.get("refresh_token");
            
            if (accessToken) {
              console.log("Found access token in hash, setting session");
              setMessage("Setting up your session...");
              
              // For recovery flow, redirect to update password
              if (type === 'recovery' || hashParams.get("type") === 'recovery') {
                setTimeout(() => {
                  navigate(`/update-password${location.hash}`);
                }, 1000);
                return;
              }
              
              // For magic links and other flows, set the session
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || "",
              });
              
              if (error) {
                console.error("Session setup error:", error);
                throw error;
              }
              
              if (data.session && data.user) {
                console.log("Session established via hash for user:", data.user.email);
                setMessage("Login successful!");
                toast({
                  title: "Login Successful",
                  description: "Welcome back to VoiceMate!"
                });
              }
            }
          } catch (e) {
            console.error("Error handling hash params:", e);
            throw e;
          }
        }
        
        // Handle redirects based on type
        switch (type) {
          case "signup":
            setMessage("Welcome! Redirecting to registration success...");
            setTimeout(() => navigate("/registration-success"), 1500);
            break;
          case "magiclink":
            setMessage("Login successful! Redirecting to dashboard...");
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
          case "invite":
            setMessage("Welcome to VoiceMate! Redirecting to dashboard...");
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
          case "recovery":
            // Already handled above
            break;
          case "email_change":
            setMessage("Email updated! Redirecting to dashboard...");
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
          default:
            // Check if we have an active session to determine where to redirect
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) {
              // If we have a session but no specific type, check if this was from magic link
              if (location.hash && location.hash.includes('access_token')) {
                setMessage("Login successful! Redirecting to dashboard...");
                setTimeout(() => navigate("/dashboard"), 1500);
              } else {
                setMessage("Authentication complete. Redirecting to dashboard...");
                setTimeout(() => navigate("/dashboard"), 1500);
              }
            } else {
              // No session, redirect to auth
              setMessage("Authentication required. Redirecting to login...");
              setTimeout(() => navigate("/auth"), 1500);
            }
            break;
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setMessage("Authentication process failed.");
        toast({
          title: "Authentication Failed",
          description: "An error occurred during authentication. Please try again.",
          variant: "destructive"
        });
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    handleAuthRedirect();
  }, [navigate, location, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
      
      <div className="text-center">
        <div className="mb-6">
          <div className="text-2xl font-semibold text-white inline-block bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate</div>
        </div>
        
        <h1 className="text-xl font-semibold mb-4 text-white">{message}</h1>
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-voicemate-purple" />
        </div>
        <p className="mt-4 text-sm text-gray-400">Please wait...</p>
      </div>
    </div>
  );
}
