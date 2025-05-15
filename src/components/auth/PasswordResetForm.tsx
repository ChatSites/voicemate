
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type PasswordResetFormProps = {
  onGoBack: () => void;
};

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onGoBack }) => {
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get the current URL's origin for the redirect URL
      const origin = window.location.origin;
      const redirectUrl = `${origin}/auth/callback?type=recovery`;
      
      console.log(`Sending password reset email with redirect to: ${redirectUrl}`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectUrl,
      });
      
      if (error) throw error;
      
      setEmailSent(true);
      toast.toast({
        title: "Password reset email sent",
        description: "Check your inbox for the password reset link",
      });
    } catch (error: any) {
      toast.toast({
        title: "Failed to send reset email",
        description: error?.message || "Please check your email and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleResetPassword}>
      <CardContent className="space-y-4">
        {emailSent ? (
          <Alert className="bg-green-900/20 border-green-800 text-green-100">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Password reset link has been sent to your email address. Please check your inbox and follow the instructions.
            </AlertDescription>
          </Alert>
        ) : (
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
              disabled={loading}
            />
            <p className="text-sm text-gray-400">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        {!emailSent ? (
          <Button 
            type="submit" 
            className="w-full bg-voicemate-purple hover:bg-voicemate-purple/90"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        ) : (
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setResetEmail('');
              setEmailSent(false);
            }}
          >
            Send Again
          </Button>
        )}
        <Button 
          type="button" 
          variant="link" 
          className="text-voicemate-purple"
          onClick={onGoBack}
        >
          Back to Login
        </Button>
      </CardFooter>
    </form>
  );
};

export default PasswordResetForm;
