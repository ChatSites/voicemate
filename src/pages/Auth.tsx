
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
        // Check if PulseID exists in profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', pulseId)
          .maybeSingle();
          
        if (error) throw error;
        
        const isAvailable = !data;
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

  // Clean up auth state to prevent issues
  const cleanupAuthState = () => {
    localStorage.removeItem('supabase.auth.token');
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submission attempts
    if (registrationInProgress) {
      return;
    }
    
    // Validate PulseID availability before proceeding
    if (pulseIdAvailable === false) {
      toast({
        title: "PulseID not available",
        description: "Please choose a different PulseID or select one of our suggestions",
        variant: "destructive",
      });
      return;
    }
    
    // Mark registration as in-progress to prevent further checks
    setRegistrationInProgress(true);
    setLoading(true);
    
    try {
      // Verify PulseID availability one last time before submitting
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', pulseId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingUser) {
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
        
        setLoading(false);
        setRegistrationInProgress(false);
        return;
      }
      
      // Clean up existing state
      cleanupAuthState();
      
      // Sign up with email/password
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            full_name: fullName,
            pulse_id: pulseId,
          },
        },
      });
      
      if (error) throw error;
      
      // Manually update the profile with the PulseID immediately to claim it
      if (data.user) {
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              username: pulseId,
            })
            .eq('id', data.user.id);
            
          if (updateError) {
            console.error('Failed to update profile:', updateError);
            // Don't throw here, we'll still consider signup successful
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
      toast({
        title: "Registration failed",
        description: error?.message || "Please check your information and try again",
        variant: "destructive",
      });
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
                    <Input 
                      id="regemail" 
                      type="email" 
                      placeholder="hello@example.com" 
                      className="bg-black/30 border-gray-700"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
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
                    disabled={loading || pulseIdAvailable === false || pulseId.length < 3 || isCheckingPulseId || registrationInProgress}
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
