
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

type PasswordResetFormProps = {
  onGoBack: () => void;
};

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onGoBack }) => {
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

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
      
      onGoBack();
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
          onClick={onGoBack}
        >
          Back to Login
        </Button>
      </CardFooter>
    </form>
  );
};

export default PasswordResetForm;
