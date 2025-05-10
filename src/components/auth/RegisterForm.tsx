
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import EmailInput from './EmailInput';
import PulseIdInput from './PulseIdInput';
import FullNameInput from './FullNameInput';
import PasswordInput from './PasswordInput';
import { registerUser } from '@/services/registrationService';

interface RegisterFormProps {
  prefilledPulseId?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ prefilledPulseId = '' }) => {
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
      isEmailValid !== false && 
      pulseId.length >= 3 && 
      pulseIdAvailable !== false &&
      registerPassword.length >= 8
    );
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

    // Check if PulseID validation previously failed
    if (pulseIdAvailable === false) {
      toast({
        title: "PulseID already taken",
        description: "Please choose a different PulseID or select one of our suggestions",
        variant: "destructive",
      });
      return;
    }
    
    // Mark registration as in-progress to prevent further checks
    setRegistrationInProgress(true);
    setLoading(true);
    
    try {
      const result = await registerUser(
        fullName,
        registerEmail,
        pulseId,
        registerPassword
      );
      
      if (!result.success) {
        // Handle PulseID taken during registration
        if (result.pulseIdAvailable === false) {
          setPulseIdAvailable(false);
          setPulseIdSuggestions(result.pulseIdSuggestions);
        }
        throw result.error;
      }
      
      // Navigate to success page
      navigate('/registration-success');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Don't show duplicate error messages
      if (!error?.message?.includes("PulseID was just taken")) {
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
          disabled={loading || 
                   pulseIdAvailable === false || 
                   pulseId.length < 3 || 
                   registrationInProgress ||
                   !isFormValid()}
        >
          {loading ? "Creating account..." : "Claim Your PulseID"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default RegisterForm;
