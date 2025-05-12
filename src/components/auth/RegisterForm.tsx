
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import EmailInput from './EmailInput';
import PulseIdInput from './PulseIdInput';
import FullNameInput from './FullNameInput';
import PasswordInput from './PasswordInput';
import { registerUser } from '@/services/registerUser';

interface RegisterFormProps {
  prefilledPulseId?: string;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ prefilledPulseId = '', onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [pulseId, setPulseId] = useState(prefilledPulseId);
  const [registerPassword, setRegisterPassword] = useState('');
  const [pulseIdAvailable, setPulseIdAvailable] = useState<boolean | null>(null);
  const [pulseIdSuggestions, setPulseIdSuggestions] = useState<string[]>([]);
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [registrationInProgress, setRegistrationInProgress] = useState(false);
  const navigate = useNavigate();

  // Set pulseId when prefilledPulseId changes
  useEffect(() => {
    if (prefilledPulseId) {
      setPulseId(prefilledPulseId);
    }
  }, [prefilledPulseId]);

  const isFormValid = () => {
    return (
      fullName.length >= 3 && 
      registerEmail && 
      registerEmail.includes('@') && 
      pulseId.length >= 3 && 
      registerPassword.length >= 8 &&
      isPasswordValid(registerPassword)
    );
  };

  const isPasswordValid = (password: string): boolean => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
    
    return hasLowercase && hasUppercase && hasNumber && hasSpecial;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submission attempts
    if (registrationInProgress) {
      return;
    }
    
    // Basic input validation
    if (!pulseId || pulseId.length < 3) {
      toast({
        title: "Invalid PulseID",
        description: "PulseID must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }
    
    if (!fullName || !registerEmail || !registerPassword) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    if (fullName.length < 3) {
      toast({
        title: "Name too short",
        description: "Please enter your full name (at least 3 characters)",
        variant: "destructive",
      });
      return;
    }

    if (registerPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }
    
    if (!isPasswordValid(registerPassword)) {
      toast({
        title: "Password too weak",
        description: "Password must include lowercase, uppercase, number, and special character",
        variant: "destructive",
      });
      return;
    }
    
    // Mark registration as in-progress to prevent further checks
    setRegistrationInProgress(true);
    setLoading(true);
    
    console.log('Attempting registration for:', registerEmail, 'with PulseID:', pulseId);
    
    try {
      const result = await registerUser(
        fullName,
        registerEmail,
        pulseId,
        registerPassword
      );
      
      console.log('Registration result:', result);
      
      if (!result.success) {
        // Handle PulseID taken during registration
        if (result.pulseIdAvailable === false) {
          setPulseIdAvailable(false);
          setPulseIdSuggestions(result.pulseIdSuggestions || []);
          throw new Error("PulseID is already taken. Please choose another one.");
        }
        
        if (result.error && result.error.message.includes("already registered")) {
          toast({
            title: "Email already registered",
            description: "This email is already in use. Please log in instead.",
            variant: "destructive",
          });
          if (onSwitchToLogin) {
            setTimeout(() => onSwitchToLogin(), 1500);
          }
          throw new Error("Email already registered");
        }
        
        if (result.error) {
          throw result.error;
        }
      }
      
      // Navigate to success page
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account",
      });
      navigate('/registration-success');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Only show error if it's not already handled above
      if (!error?.message?.includes("already registered") && 
          !error?.message?.includes("PulseID is already taken")) {
        toast({
          title: "Registration failed",
          description: error?.message || "Please check your information and try again",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setRegistrationInProgress(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <CardContent className="space-y-4">
        <FullNameInput 
          fullName={fullName} 
          setFullName={setFullName} 
          registrationInProgress={registrationInProgress} 
        />
        
        <EmailInput
          email={registerEmail}
          setEmail={setRegisterEmail}
          isEmailValid={isEmailValid}
          setIsEmailValid={setIsEmailValid}
          registrationInProgress={registrationInProgress}
        />
        
        <PulseIdInput
          pulseId={pulseId}
          setPulseId={setPulseId}
          pulseIdAvailable={pulseIdAvailable}
          setPulseIdAvailable={setPulseIdAvailable}
          pulseIdSuggestions={pulseIdSuggestions}
          setPulseIdSuggestions={setPulseIdSuggestions}
          registrationInProgress={registrationInProgress}
        />
        
        <PasswordInput
          password={registerPassword}
          setPassword={setRegisterPassword}
          registrationInProgress={registrationInProgress}
        />
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-voicemate-red hover:bg-red-600"
          disabled={loading || !isFormValid() || registrationInProgress}
        >
          {loading ? "Creating account..." : "Claim Your PulseID"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default RegisterForm;
