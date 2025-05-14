
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import { FormFeedback } from '@/components/ui/form-feedback';

interface EmailInputProps {
  email: string;
  setEmail: (email: string) => void;
  isEmailValid: boolean | null;
  setIsEmailValid: (isValid: boolean | null) => void;
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

  // Validate email format when email changes
  useEffect(() => {
    // Clear any previous timeout to prevent multiple validations
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current);
    }

    // Skip validation if the field hasn't been touched yet
    if (!isTouched || email.length === 0) {
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(email);
    
    setIsCheckingEmail(true);
    
    // Use timeout to debounce and prevent excessive state updates
    emailCheckTimeoutRef.current = setTimeout(() => {
      setIsEmailValid(isValidFormat);
      setIsCheckingEmail(false);
    }, 300);

    // Cleanup function
    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }
    };
  }, [email, isTouched, setIsEmailValid]); // Add proper dependencies

  // Handle email input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <div className="relative">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          onBlur={() => setIsTouched(true)}
          placeholder="name@example.com"
          className="bg-black/30 border-gray-700 pr-10"
          disabled={registrationInProgress}
          required
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
      {isEmailValid === false && isTouched && !isCheckingEmail && (
        <FormFeedback variant="error">
          Please enter a valid email address
        </FormFeedback>
      )}
    </div>
  );
};

export default EmailInput;
