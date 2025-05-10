
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase, cleanupAuthState, isEmailRegistered } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [pulseId, setPulseId] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [pulseIdAvailable, setPulseIdAvailable] = useState<boolean | null>(null);
  const [pulseIdSuggestions, setPulseIdSuggestions] = useState<string[]>([]);
  const [isCheckingPulseId, setIsCheckingPulseId] = useState(false);
  const [registrationInProgress, setRegistrationInProgress] = useState(false);
  const [lastCheckedPulseId, setLastCheckedPulseId] = useState('');
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  
  // Reset password state
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);

  // Email validation (check if already registered)
  useEffect(() => {
    if (registrationInProgress || !registerEmail) {
      return;
    }

    // Validate email format first
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      setIsEmailValid(null);
      return;
    }

    const checkEmailAvailability = async () => {
      setIsCheckingEmail(true);
      try {
        const isRegistered = await isEmailRegistered(registerEmail);
        setIsEmailValid(!isRegistered);
      } catch (error) {
        console.error('Error checking email availability:', error);
        setIsEmailValid(null);
      } finally {
        setIsCheckingEmail(false);
      }
    };

    const timerId = setTimeout(checkEmailAvailability, 600);
    return () => clearTimeout(timerId);
  }, [registerEmail, registrationInProgress]);

  // PulseID verification
  useEffect(() => {
    // Skip checking if registration is in progress to avoid UI confusion
    if (registrationInProgress) return;

    const checkPulseId = async () => {
      if (!pulseId || pulseId.length < 3) {
        setPulseIdAvailable(null);
        setPulseIdSuggestions([]);
        return;
      }

      setIsCheckingPulseId(true);
      
      try {
        console.log(`Checking availability for PulseID: ${pulseId}`);
        
        // Check if PulseID exists in profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', pulseId)
          .maybeSingle();
          
        if (error) {
          console.error('Error checking PulseID:', error);
          throw error;
        }
        
        const isAvailable = !data;
        console.log(`PulseID ${pulseId} is ${isAvailable ? 'available' : 'taken'}`);
        
        setLastCheckedPulseId(pulseId);
        setPulseIdAvailable(isAvailable);
        
        // Generate suggestions if not available
        if (!isAvailable) {
          const suggestions = [
            `${pulseId}${Math.floor(Math.random() * 100)}`,
            `${pulseId}_${Math.floor(Math.random() * 100)}`,
            `${pulseId}${Math.floor(Math.random() * 900) + 100}`,
          ];
          setPulseIdSuggestions(suggestions);
        } else {
          setPulseIdSuggestions([]);
        }
      } catch (error) {
        console.error('Error checking PulseID:', error);
        setPulseIdAvailable(null);
      } finally {
        setIsCheckingPulseId(false);
      }
    };
    
    // Debounce the check to avoid too many requests
    const timerId = setTimeout(checkPulseId, 500);
    return () => clearTimeout(timerId);
  }, [pulseId, registrationInProgress]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Sign in with email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Login successful",
          description: "Welcome back to VoiceMate",
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isPulseIdStillAvailable = async (id: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', id)
        .maybeSingle();
        
      if (error) throw error;
      
      return !data; // Return true if no data is found (ID is available)
    } catch (error) {
      console.error('Error in final PulseID check:', error);
      return false; // Assume not available on error (safer)
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submission attempts
    if (registrationInProgress) {
      return;
    }
    
    // Basic input validation
    if (!pulseId || pulseId.length < 3) {
      toast({
        title: "Invalid PulseID",
        description: "PulseID must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }
    
    if (!fullName || !registerEmail || !registerPassword) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Check if email is already registered
    if (isEmailValid === false) {
      toast({
        title: "Email already registered",
        description: "This email address is already in use. Please use a different email or try to log in instead.",
        variant: "destructive",
      });
      return;
    }
    
    // Mark registration as in-progress to prevent further checks
    setRegistrationInProgress(true);
    setLoading(true);
    
    try {
      // Do one final check for email availability
      const emailIsRegistered = await isEmailRegistered(registerEmail);
      if (emailIsRegistered) {
        toast({
          title: "Email already registered",
          description: "This email address is already in use. Please use a different email or try to log in.",
          variant: "destructive",
        });
        setIsEmailValid(false);
        throw new Error("Email already registered");
      }
      
      console.log('Starting registration for PulseID:', pulseId);
      
      // Final verification: PulseID still available right before sign-up?
      const finalCheck = await isPulseIdStillAvailable(pulseId);
      
      if (!finalCheck) {
        console.log('Final check failed - PulseID is now taken');
        // PulseID is taken, update state and notify user
        setPulseIdAvailable(false);
        
        // Generate suggestions
        const suggestions = [
          `${pulseId}${Math.floor(Math.random() * 100)}`,
          `${pulseId}_${Math.floor(Math.random() * 100)}`,
          `${pulseId}${Math.floor(Math.random() * 900) + 100}`,
        ];
        setPulseIdSuggestions(suggestions);
        
        toast({
          title: "PulseID was just taken",
          description: "Someone claimed this PulseID while you were registering. Please choose another or select one of our suggestions.",
          variant: "destructive",
        });
        
        throw new Error("PulseID was just taken");
      }
      
      console.log('Final check passed - PulseID is still available');
      
      // Clean up existing state
      cleanupAuthState();
      
      // Now we're ready to create the user account
      // Sign up with email/password
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            full_name: fullName,
            username: pulseId,
          },
        },
      });
      
      if (error) {
        // If we get a user_already_exists error, update UI accordingly
        if (error.message.includes("User already registered")) {
          setIsEmailValid(false);
          toast({
            title: "Email already registered",
            description: "This email is already registered. Please try logging in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration failed",
            description: error.message || "Something went wrong during registration",
            variant: "destructive",
          });
        }
        throw error;
      }
      
      // Manually update the profile with the PulseID to claim it
      if (data.user) {
        try {
          console.log('Updating profile for user:', data.user.id);
          const { error: updateError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              username: pulseId,
            });
            
          if (updateError) {
            console.error('Failed to update profile:', updateError);
            // Don't throw here, we'll still consider signup successful
          } else {
            console.log('Successfully updated profile with username:', pulseId);
          }
        } catch (profileError) {
          console.error('Failed to update profile:', profileError);
          // Continue as this isn't critical - auth still worked
        }
      }
      
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account",
      });
      
      // Navigate back to login tab
      const loginTab = document.querySelector('[data-state="inactive"][data-value="login"]') as HTMLElement | null;
      if (loginTab) {
        loginTab.click();
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Don't show duplicate error messages
      if (!error.message.includes("Email already registered") && 
          !error.message.includes("PulseID was just taken")) {
        toast({
          title: "Registration failed",
          description: error?.message || "Please check your information and try again",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setRegistrationInProgress(false);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?tab=update-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link",
      });
      
      setShowResetForm(false);
    } catch (error: any) {
      toast({
        title: "Failed to send reset email",
        description: error?.message || "Please check your email and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const selectSuggestion = (suggestion: string) => {
    setPulseId(suggestion);
    // Set as available since we generated this suggestion
    setPulseIdAvailable(true);
    setLastCheckedPulseId(suggestion);
    setPulseIdSuggestions([]);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-mesh-gradient animate-gradient-y -z-10 opacity-10"></div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-white inline-block bg-clip-text text-transparent bg-gradient-to-r from-voicemate-purple to-voicemate-red">VoiceMate</a>
        </div>
        
        <Card className="border border-gray-800 bg-voicemate-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-center">Welcome to VoiceMate</CardTitle>
            <CardDescription className="text-center">Login or claim your PulseID</CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 bg-black/20">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Claim ID</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              {!showResetForm ? (
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="hello@example.com" 
                        className="bg-black/30 border-gray-700"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        className="bg-black/30 border-gray-700"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-voicemate-purple hover:bg-voicemate-purple/90"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="text-voicemate-purple"
                      onClick={() => setShowResetForm(true)}
                    >
                      Forgot Password?
                    </Button>
                  </CardFooter>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <Input 
                        id="reset-email" 
                        type="email" 
                        placeholder="hello@example.com" 
                        className="bg-black/30 border-gray-700"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required 
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-voicemate-purple hover:bg-voicemate-purple/90"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="text-voicemate-purple"
                      onClick={() => setShowResetForm(false)}
                    >
                      Back to Login
                    </Button>
                  </CardFooter>
                </form>
              )}
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input 
                      id="fullname" 
                      type="text" 
                      placeholder="John Doe" 
                      className="bg-black/30 border-gray-700"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regemail">Email</Label>
                    <div className="relative">
                      <Input 
                        id="regemail" 
                        type="email" 
                        placeholder="hello@example.com" 
                        className={`bg-black/30 border-gray-700 ${
                          isEmailValid === false ? "border-red-500" : 
                          isEmailValid === true ? "border-green-500" : ""
                        }`}
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        disabled={registrationInProgress}
                      />
                      {isCheckingEmail && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-4 w-4 border-2 border-t-transparent border-voicemate-purple rounded-full animate-spin"></div>
                        </div>
                      )}
                      {!isCheckingEmail && isEmailValid !== null && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isEmailValid ? (
                            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                          ) : (
                            <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                      )}
                    </div>
                    {isEmailValid === false && (
                      <p className="text-sm text-red-400">This email is already registered. Please log in instead.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pulse-id">Desired PulseID</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm bg-black/50 rounded-l-md border border-r-0 border-gray-700 text-gray-400">
                        pulse/
                      </span>
                      <div className="relative flex-1">
                        <Input 
                          id="pulse-id" 
                          placeholder="yourname" 
                          className="rounded-l-none bg-black/30 border-gray-700"
                          value={pulseId}
                          onChange={(e) => setPulseId(e.target.value)}
                          required
                          disabled={registrationInProgress}
                        />
                        {isCheckingPulseId && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="h-4 w-4 border-2 border-t-transparent border-voicemate-purple rounded-full animate-spin"></div>
                          </div>
                        )}
                        {!isCheckingPulseId && pulseIdAvailable !== null && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {pulseIdAvailable ? (
                              <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                            ) : (
                              <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {pulseIdAvailable === false && pulseIdSuggestions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-amber-400 mb-1">This PulseID is already taken. Try one of these:</p>
                        <div className="flex flex-wrap gap-2">
                          {pulseIdSuggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              type="button"
                              size="sm"
                              variant="outline"
                              className="text-xs border-voicemate-purple text-voicemate-purple hover:bg-voicemate-purple/20"
                              onClick={() => selectSuggestion(suggestion)}
                              disabled={registrationInProgress}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    {pulseId.length > 0 && pulseId.length < 3 && (
                      <p className="text-sm text-amber-400">PulseID must be at least 3 characters</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regpassword">Password</Label>
                    <Input 
                      id="regpassword" 
                      type="password" 
                      className="bg-black/30 border-gray-700"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-voicemate-red hover:bg-red-600"
                    disabled={loading || 
                             pulseIdAvailable === false || 
                             pulseId.length < 3 || 
                             isCheckingPulseId || 
                             registrationInProgress || 
                             isEmailValid === false ||
                             isCheckingEmail}
                  >
                    {loading ? "Creating account..." : "Claim Your PulseID"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <a href="/" className="text-voicemate-purple hover:text-voicemate-red transition-colors">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
