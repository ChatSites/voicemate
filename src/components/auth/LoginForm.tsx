
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type LoginFormProps = {
  onShowResetForm: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onShowResetForm }) => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log("Login attempt with:", loginEmail);
      
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.warn("Sign out before login failed:", err);
      }
      
      // Sign in with email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      console.log("Login response:", { data: data ? 'received' : 'none', error: error ? 'error' : 'none' });
      
      if (error) throw error;
      
      if (data.user) {
        try {
          toast.toast({
            title: "Login successful",
            description: "Welcome back to VoiceMate",
          });
        } catch (toastError) {
          console.error("Failed to show toast notification:", toastError);
        }
        
        // Refresh the session state in the context
        await refreshSession();
        
        // Navigate to home page
        setTimeout(() => {
          navigate('/');
        }, 100);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error?.message || "Authentication failed");
      
      try {
        toast.toast({
          title: "Login failed",
          description: error?.message || "Please check your credentials and try again",
          variant: "destructive",
        });
      } catch (toastError) {
        console.error("Failed to show error toast:", toastError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-md text-sm text-red-200">
            {error}
          </div>
        )}
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
            disabled={loading}
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
            disabled={loading}
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
          onClick={onShowResetForm}
          disabled={loading}
        >
          Forgot Password?
        </Button>
      </CardFooter>
    </form>
  );
};

export default LoginForm;
