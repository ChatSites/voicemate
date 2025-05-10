
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

type LoginFormProps = {
  onShowResetForm: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onShowResetForm }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

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

  return (
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
          onClick={onShowResetForm}
        >
          Forgot Password?
        </Button>
      </CardFooter>
    </form>
  );
};

export default LoginForm;
