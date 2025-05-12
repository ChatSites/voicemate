
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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
        
        // Handle auth redirect with code
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error("Auth error:", error.message);
            setMessage("There was a problem confirming your account.");
            toast({
              title: "Authentication Error",
              description: error.message,
              variant: "destructive"
            });
            return;
          }
          
          console.log("Auth flow completed successfully", data);
        } 
        // Handle hash-based redirects (older format)
        else if (location.hash) {
          try {
            // Try to parse token from hash manually
            const hashParams = new URLSearchParams(location.hash.substring(1));
            const accessToken = hashParams.get("access_token");
            
            if (accessToken) {
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: hashParams.get("refresh_token") || "",
              });
              
              if (error) throw error;
            }
          } catch (e) {
            console.error("Error handling hash params:", e);
          }
        }

        // Get type from query parameters
        const type = searchParams.get("type");
        console.log("Auth callback type:", type);
        
        switch (type) {
          case "signup":
            setMessage("Welcome! Redirecting you to your dashboard...");
            toast({
              title: "Registration Successful",
              description: "Your account has been created successfully."
            });
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
          case "magiclink":
          case "invite":
            setMessage("Login successful! Redirecting...");
            toast({
              title: "Login Successful",
              description: "Welcome back!"
            });
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
          case "recovery":
            setMessage("Redirecting to password reset page...");
            toast({
              title: "Password Reset",
              description: "Please set your new password."
            });
            // Ensure we pass the access token to the update-password page if it exists
            const accessToken = searchParams.get("access_token") || 
                                new URLSearchParams(location.hash.substring(1)).get("access_token");
            
            setTimeout(() => {
              if (accessToken) {
                navigate(`/update-password?access_token=${accessToken}`);
              } else {
                navigate("/update-password");
              }
            }, 1500);
            break;
          case "email_change":
            setMessage("Email updated! Redirecting...");
            toast({
              title: "Email Updated",
              description: "Your email has been updated successfully."
            });
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
          default:
            setMessage("Authentication complete.");
            setTimeout(() => navigate("/dashboard"), 1500);
            break;
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setMessage("Authentication process failed.");
        toast({
          title: "Authentication Failed",
          description: "An error occurred during authentication.",
          variant: "destructive"
        });
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
