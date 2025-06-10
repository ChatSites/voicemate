
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
    
    console.log('=== REGISTRATION HANDLER CALLED ===');
    console.log('Form data received:', {
      fullName: formState.fullName,
      email: formState.registerEmail,
      pulseId: formState.pulseId,
      passwordLength: formState.registerPassword.length,
      registrationInProgress: formState.registrationInProgress
    });
    
    // Prevent multiple submission attempts
    if (formState.registrationInProgress) {
      console.log('Registration already in progress, ignoring submission');
      return;
    }
    
    // Form validation
    console.log('Validating form...');
    if (!validateRegistrationForm(formState)) {
      console.log('Form validation failed');
      toast({
        title: "Please complete all fields",
        description: "Make sure all fields are filled out properly before registering.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Form validation passed, starting registration...');
    
    // Mark registration as in-progress
    console.log('Setting registration in progress...');
    setRegistrationInProgress(true);
    setLoading(true);
    
    try {
      console.log('Calling registration service...');
      
      const result = await registerUser(
        formState.fullName,
        formState.registerEmail,
        formState.pulseId,
        formState.registerPassword
      );
      
      console.log('Registration service completed with result:', {
        success: result.success,
        hasUser: !!result.user,
        hasSession: !!result.session,
        emailConfirmNeeded: result.emailConfirmNeeded,
        error: result.error?.message
      });
      
      if (!result.success) {
        // Handle PulseID taken during registration
        if (result.pulseIdAvailable === false) {
          console.log('PulseID was taken during registration');
          setPulseIdAvailable(false);
          setPulseIdSuggestions(result.pulseIdSuggestions || []);
          toast({
            title: "PulseID taken",
            description: "This PulseID is already in use. Please choose another one.",
            variant: "destructive"
          });
          return;
        }
        
        // Handle email already registered
        if (result.error && result.error.message.includes("already registered")) {
          console.log('Email already registered');
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
        
        // Handle other errors
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
      console.log('Registration successful!');
      
      if (result.emailConfirmNeeded) {
        toast({
          title: "Registration successful!",
          description: "Please check your email and click the verification link to complete your registration. Your profile is being set up in the background.",
        });
        
        // Navigate to success page which will show email confirmation instructions
        setTimeout(() => {
          navigate('/registration-success');
        }, 1000);
      } else {
        toast({
          title: "Registration successful!",
          description: "Welcome to VoiceMate! Your account is ready and your profile has been created.",
        });
        
        // Navigate to dashboard if already confirmed
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
      
    } catch (error: any) {
      console.error('=== REGISTRATION HANDLER EXCEPTION ===', error);
      toast({
        title: "Registration failed",
        description: error?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log('Resetting registration state...');
      setLoading(false);
      setRegistrationInProgress(false);
      console.log('=== REGISTRATION PROCESS COMPLETE ===');
    }
  };

  return { handleRegister };
};
