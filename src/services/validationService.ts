
import { toast } from "@/hooks/use-toast";
import { RegistrationFormState } from '@/hooks/useRegistrationForm';

export const validateRegistrationForm = (formState: RegistrationFormState): boolean => {
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
