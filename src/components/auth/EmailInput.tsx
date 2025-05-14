
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleX, CircleCheck, Loader2 } from 'lucide-react';
import { isEmailRegistered } from '@/integrations/supabase/client';

type EmailInputProps = {
  email: string;
  setEmail: (email: string) => void;
  isEmailValid: boolean | null;
  setIsEmailValid: (valid: boolean | null) => void;
  registrationInProgress: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({
  email,
  setEmail,
  isEmailValid,
  setIsEmailValid,
  registrationInProgress
}) => {
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // Email validation - now we just validate format, not existence
  useEffect(() => {
    if (registrationInProgress || !email) {
      return;
    }

    // Reset the email validity state when email changes
    setIsEmailValid(null);

    // Validate email format first - this is the basic check we'll do here
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    // Don't check for existence during typing - let the registration process handle this
    setIsEmailValid(true);
  }, [email, registrationInProgress, setIsEmailValid]);

  return (
    <div className="space-y-2">
      <Label htmlFor="regemail">Email</Label>
      <div className="relative">
        <Input 
          id="regemail" 
          type="email" 
          placeholder="hello@example.com" 
          className={`bg-black/30 border-gray-700 text-white ${
            isEmailValid === false ? "border-red-500" : 
            isEmailValid === true ? "border-green-500" : ""
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={registrationInProgress}
        />
        {isCheckingEmail && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 text-voicemate-purple animate-spin" />
          </div>
        )}
        {!isCheckingEmail && isEmailValid !== null && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isEmailValid ? (
              <CircleCheck className="h-4 w-4 text-green-500" />
            ) : (
              <CircleX className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      {isEmailValid === false && (
        <p className="text-sm text-red-400">This email is already registered. Please log in instead.</p>
      )}
    </div>
  );
};

export default EmailInput;
