
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { registerUser } from '@/services/registrationService';
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
      console.log('Registration already in progress, ignoring submission');
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
    
    console.log('=== STARTING REGISTRATION PROCESS ===');
    console.log('Form data:', {
      fullName: formState.fullName,
      email: formState.registerEmail,
      pulseId: formState.pulseId,
      passwordLength: formState.registerPassword.length
    });
    
    try {
      const result = await registerUser(
        formState.fullName,
        formState.registerEmail,
        formState.pulseId,
        formState.registerPassword
      );
      
      console.log('Registration service result:', result);
      
      if (!result.success) {
        // Handle PulseID taken during registration
        if (result.pulseIdAvailable === false) {
          setPulseIdAvailable(false);
          setPulseIdSuggestions(result.pulseIdSuggestions || []);
          toast({
            title: "PulseID taken",
            description: "This PulseID is already in use. Please choose another one.",
            variant: "destructive"
          });
          return;
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
          return;
        }
        
        if (result.error) {
          console.error('Registration failed with error:', result.error);
          toast({
            title: "Registration failed",
            description: result.error.message,
            variant: "destructive",
          });
          return;
        }
      }
      
      // Registration successful
      console.log('Registration successful, showing success toast');
      
      if (result.emailConfirmNeeded) {
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account before signing in.",
        });
      } else {
        toast({
          title: "Registration successful",
          description: "Welcome to VoiceMate! You are now signed in.",
        });
      }
      
      // Small delay to allow auth state to update before navigation
      console.log('Navigating to registration success page');
      setTimeout(() => {
        navigate('/registration-success');
      }, 500);
      
    } catch (error: any) {
      console.error('=== REGISTRATION HANDLER ERROR ===', error);
      toast({
        title: "Registration failed",
        description: error?.message || "Please check your information and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRegistrationInProgress(false);
      console.log('=== REGISTRATION PROCESS COMPLETE ===');
    }
  };

  return { handleRegister };
};
