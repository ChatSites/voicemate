
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
    setLoading(true);
    
    try {
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
      
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account",
      });
      
      // Navigate back to login tab
      const loginTab = document.querySelector('[data-state="inactive"][data-value="login"]') as HTMLElement;
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
                      <Input 
                        id="pulse-id" 
                        placeholder="yourname" 
                        className="rounded-l-none bg-black/30 border-gray-700"
                        value={pulseId}
                        onChange={(e) => setPulseId(e.target.value)}
                        required
                      />
                    </div>
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
                    disabled={loading}
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
