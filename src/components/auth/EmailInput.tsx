
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import { isEmailRegistered } from '@/integrations/supabase/client';
import FormFeedback from '@/components/ui/form-feedback';

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
  const [isTouched, setIsTouched] = useState(false);
  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Email validation with existence check
  useEffect(() => {
    if (registrationInProgress || !email) {
      return;
    }

    // Clear any existing timeout to prevent multiple checks
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current);
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (email.length > 0 && isTouched) {
        setIsEmailValid(false);
      } else {
        // Reset validation state when email is emptied or not touched yet
        setIsEmailValid(null);
      }
      return;
    }

    // Only check with the server if the email format is valid
    // and we have at least 5 characters (to avoid unnecessary checks)
    if (email.length >= 5 && isTouched) {
      setIsCheckingEmail(true);
      
      emailCheckTimeoutRef.current = setTimeout(async () => {
        try {
          console.log('Checking if email is registered:', email);
          const isRegistered = await isEmailRegistered(email);
          console.log('Email registration check result:', isRegistered);
          
          // If isRegistered is true, email exists and is NOT valid for registration
          // If isRegistered is false, email doesn't exist and IS valid for registration
          setIsEmailValid(!isRegistered);
        } catch (error) {
          console.error('Error checking email availability:', error);
          // On error, assume email is valid to allow form submission
          setIsEmailValid(true);
        } finally {
          setIsCheckingEmail(false);
        }
      }, 600);
    } else if (!isTouched) {
      // Reset validation if not touched yet
      setIsEmailValid(null);
    }

    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }
    };
  }, [email, registrationInProgress, isTouched, setIsEmailValid]);

  return (
    <div className="space-y-2">
      <Label htmlFor="regemail">Email</Label>
      <div className="relative">
        <Input 
          id="regemail" 
          type="email" 
          placeholder="hello@example.com" 
          className="bg-black/30 border-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setIsTouched(true)}
          required
          disabled={registrationInProgress}
        />
        {isCheckingEmail && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 text-voicemate-purple animate-spin" />
          </div>
        )}
        {!isCheckingEmail && isEmailValid !== null && isTouched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isEmailValid ? (
              <CircleCheck className="h-4 w-4 text-green-500" />
            ) : (
              <CircleX className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      {isEmailValid === false && isTouched && (
        <FormFeedback 
          type="error"
          message="This email is already registered or is invalid. Please use another email."
        />
      )}
    </div>
  );
};

export default EmailInput;
