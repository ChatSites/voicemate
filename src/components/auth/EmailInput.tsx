
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
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

  // Simple email validation with format check only
  useEffect(() => {
    if (registrationInProgress || !email) {
      return;
    }

    // Clear any existing timeout
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current);
    }

    // Only proceed with validation if the field has been touched
    if (!isTouched) {
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(email);
    
    setIsCheckingEmail(true);
    
    emailCheckTimeoutRef.current = setTimeout(() => {
      setIsEmailValid(isValidFormat);
      setIsCheckingEmail(false);
    }, 300);

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
          message="Please enter a valid email address."
        />
      )}
    </div>
  );
};

export default EmailInput;
