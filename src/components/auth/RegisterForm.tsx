
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import EmailInput from './EmailInput';
import PulseIdInput from './PulseIdInput';
import FullNameInput from './FullNameInput';
import PasswordInput from './PasswordInput';
import RegistrationSubmitButton from './RegistrationSubmitButton';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';
import { registerUser } from '@/services/registerUser';

interface RegisterFormProps {
  prefilledPulseId?: string;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ prefilledPulseId = '', onSwitchToLogin }) => {
  const navigate = useNavigate();
  const {
    formState,
    updateField,
    isFormValid,
    setPulseIdAvailable,
    setPulseIdSuggestions,
    setIsEmailValid,
    setRegistrationInProgress,
    setLoading
  } = useRegistrationForm(prefilledPulseId);

  const validateForm = (): boolean => {
    // Basic input validation
    if (!formState.pulseId || formState.pulseId.length < 3) {
      toast({
        title: "Invalid PulseID",
        description: "PulseID must be at least 3 characters",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formState.fullName || !formState.registerEmail || !formState.registerPassword) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return false;
    }

    if (formState.fullName.length < 3) {
      toast({
        title: "Name too short",
        description: "Please enter your full name (at least 3 characters)",
        variant: "destructive",
      });
      return false;
    }

    if (formState.registerPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if email is valid
    if (formState.isEmailValid === false) {
      toast({
        title: "Email already registered",
        description: "This email is already taken. Please use another one or log in.",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if PulseID is available
    if (formState.pulseIdAvailable === false) {
      toast({
        title: "PulseID already taken",
        description: "This PulseID is already taken. Please choose another one.",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if password meets complexity requirements
    const hasLowercase = /[a-z]/.test(formState.registerPassword);
    const hasUppercase = /[A-Z]/.test(formState.registerPassword);
    const hasNumber = /[0-9]/.test(formState.registerPassword);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(formState.registerPassword);
    
    if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecial) {
      toast({
        title: "Password too weak",
        description: "Password must include lowercase, uppercase, number, and special character",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submission attempts
    if (formState.registrationInProgress) {
      return;
    }
    
    // Form validation
    if (!validateForm()) {
      return;
    }
    
    // Mark registration as in-progress to prevent further checks
    setRegistrationInProgress(true);
    setLoading(true);
    
    console.log('Attempting registration for:', formState.registerEmail, 'with PulseID:', formState.pulseId);
    
    try {
      const result = await registerUser(
        formState.fullName,
        formState.registerEmail,
        formState.pulseId,
        formState.registerPassword
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
          fullName={formState.fullName} 
          setFullName={(value) => updateField('fullName', value)} 
          registrationInProgress={formState.registrationInProgress} 
        />
        
        <EmailInput
          email={formState.registerEmail}
          setEmail={(value) => updateField('registerEmail', value)}
          isEmailValid={formState.isEmailValid}
          setIsEmailValid={setIsEmailValid}
          registrationInProgress={formState.registrationInProgress}
        />
        
        <PulseIdInput
          pulseId={formState.pulseId}
          setPulseId={(value) => updateField('pulseId', value)}
          pulseIdAvailable={formState.pulseIdAvailable}
          setPulseIdAvailable={setPulseIdAvailable}
          pulseIdSuggestions={formState.pulseIdSuggestions}
          setPulseIdSuggestions={setPulseIdSuggestions}
          registrationInProgress={formState.registrationInProgress}
        />
        
        <PasswordInput
          password={formState.registerPassword}
          setPassword={(value) => updateField('registerPassword', value)}
          registrationInProgress={formState.registrationInProgress}
        />
      </CardContent>
      
      <CardFooter>
        <RegistrationSubmitButton 
          isLoading={formState.loading} 
          isFormValid={isFormValid()} 
          isRegistrationInProgress={formState.registrationInProgress}
        />
      </CardFooter>
    </form>
  );
};

export default RegisterForm;
