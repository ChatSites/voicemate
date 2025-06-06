
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
        console.log("Auth callback initiated with:", {
          hash: location.hash,
          search: location.search,
          pathname: location.pathname
        });

        const code = searchParams.get("code") || 
                     new URLSearchParams(location.hash.substring(1)).get("code");
        
        // Get type from query parameters
        const type = searchParams.get("type") || 
                     new URLSearchParams(location.hash.substring(1)).get("type");
        
        console.log("Auth callback type:", type, "code present:", !!code);
        
        let authResult = null;
        
        // Handle code-based authentication (email confirmation, magic links)
        if (code) {
          setMessage("Processing authentication code...");
          console.log("Exchanging code for session");
          
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
          
          authResult = data;
          console.log("Auth flow completed successfully", {
            hasSession: !!data.session,
            hasUser: !!data.user,
            userEmail: data.user?.email
          });
          
          // For signup confirmations, ensure the user profile exists
          if (type === "signup" && data.user && data.session) {
            console.log("Signup confirmation - checking user profile exists");
            
            const { data: userProfile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();
            
            if (profileError || !userProfile) {
              console.log("User profile not found, attempting to create from metadata");
              
              // Try to create profile from user metadata
              const fullName = data.user.user_metadata?.full_name || data.user.email?.split('@')[0];
              const pulseId = data.user.user_metadata?.pulse_id;
              
              if (pulseId) {
                const { error: insertError } = await supabase
                  .from('users')
                  .insert({
                    id: data.user.id,
                    name: fullName,
                    pulse_id: pulseId,
                    email: data.user.email
                  });
                
                if (insertError) {
                  console.error("Failed to create user profile:", insertError);
                } else {
                  console.log("User profile created successfully");
                }
              }
            } else {
              console.log("User profile already exists:", userProfile);
            }
          }
        } 
        // Handle hash-based redirects (older format)
        else if (location.hash) {
          try {
            const hashParams = new URLSearchParams(location.hash.substring(1));
            const accessToken = hashParams.get("access_token");
            const refreshToken = hashParams.get("refresh_token");
            
            if (accessToken) {
              console.log("Found access token in hash, setting session");
              setMessage("Setting up your session...");
              
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || "",
              });
              
              if (error) {
                console.error("Session setup error:", error);
                throw error;
              }
              
              authResult = data;
              console.log("Session established via hash for user:", data.user?.email);
            }
          } catch (e) {
            console.error("Error handling hash params:", e);
            throw e;
          }
        }
        
        // If we have a successful auth result, handle the redirect
        if (authResult?.session && authResult?.user) {
          console.log("Authentication successful, determining redirect...");
          
          // Handle redirects based on type
          switch (type) {
            case "signup":
            case "email_change":
              setMessage("Account confirmed! Redirecting to registration success...");
              toast({
                title: "Account Confirmed",
                description: "Your account has been verified successfully."
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
              
            default:
              // For any successful authentication without a specific type (including magic links),
              // redirect to dashboard
              console.log("No specific type, redirecting authenticated user to dashboard");
              setMessage("Login successful! Redirecting to dashboard...");
              toast({
                title: "Login Successful",
                description: "Welcome to VoiceMate!"
              });
              setTimeout(() => navigate("/dashboard"), 1500);
              break;
          }
        } else {
          // No session established
          console.log("No session established, redirecting to auth");
          setMessage("Authentication required. Redirecting to login...");
          setTimeout(() => navigate("/auth"), 1500);
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
