
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { registerUser } from '@/services/registerUser';
import { validateRegistrationForm } from '@/services/validationService';
import { RegistrationFormState } from '@/hooks/useRegistrationForm';

export const useRegistrationHandler = (
  formState: RegistrationFormState,
  setRegistrationInProgress: (value: boolean) => void,
  setLoading: (value: boolean) => void,
  setPulseIdAvailable: (value: boolean | null) => void,
  setPulseIdSuggestions: (values: string[]) => void,
  onSwitchToLogin?: () => void
) => {
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submission attempts
    if (formState.registrationInProgress) {
      return;
    }
    
    // Form validation
    if (!validateRegistrationForm(formState)) {
      toast({
        title: "Please complete all fields",
        description: "Make sure all fields are filled out properly before registering.",
        variant: "destructive"
      });
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
      
      // Registration successful - show toast and navigate to success page
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      });
      
      // Navigate to registration success page
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

  return { handleRegister };
};
