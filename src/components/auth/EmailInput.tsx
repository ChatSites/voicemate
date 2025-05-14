
import React, { useState, useEffect } from 'react';
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

  // Email validation with existence check
  useEffect(() => {
    if (registrationInProgress || !email) {
      return;
    }

    // Reset the email validity state when email changes
    setIsEmailValid(null);

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (email.length > 0 && isTouched) {
        setIsEmailValid(false);
      }
      return;
    }

    // Only check with the server if the email format is valid
    // and we have at least 5 characters (to avoid unnecessary checks)
    if (email.length >= 5) {
      setIsCheckingEmail(true);
      
      const checkEmailAvailability = async () => {
        try {
          console.log('Checking if email is available:', email);
          const isRegistered = await isEmailRegistered(email);
          console.log('Email check result:', email, isRegistered ? 'taken' : 'available');
          setIsEmailValid(!isRegistered);
        } catch (error) {
          console.error('Error checking email availability:', error);
          // On error, assume email is valid to allow form submission
          setIsEmailValid(true);
        } finally {
          setIsCheckingEmail(false);
        }
      };

      const timerId = setTimeout(checkEmailAvailability, 600);
      return () => clearTimeout(timerId);
    }
  }, [email, registrationInProgress, setIsEmailValid, isTouched]);

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
