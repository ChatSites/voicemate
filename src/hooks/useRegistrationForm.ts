
import { useState, useEffect } from 'react';

export interface RegistrationFormData {
  fullName: string;
  registerEmail: string;
  pulseId: string;
  registerPassword: string;
}

export interface RegistrationFormState extends RegistrationFormData {
  pulseIdAvailable: boolean | null;
  pulseIdSuggestions: string[];
  isEmailValid: boolean | null;
  registrationInProgress: boolean;
  loading: boolean;
}

export const useRegistrationForm = (prefilledPulseId: string = '') => {
  const [formState, setFormState] = useState<RegistrationFormState>({
    fullName: '',
    registerEmail: '',
    pulseId: prefilledPulseId,
    registerPassword: '',
    pulseIdAvailable: null,
    pulseIdSuggestions: [],
    isEmailValid: null,
    registrationInProgress: false,
    loading: false,
  });

  // Update pulseId when prefilledPulseId changes
  useEffect(() => {
    if (prefilledPulseId) {
      setFormState(prev => ({ ...prev, pulseId: prefilledPulseId }));
    }
  }, [prefilledPulseId]);

  const updateField = (field: keyof RegistrationFormData, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formState.fullName.length >= 3 && 
      formState.registerEmail && 
      formState.registerEmail.includes('@') && 
      formState.pulseId.length >= 3 && 
      formState.registerPassword.length >= 8 &&
      isPasswordValid(formState.registerPassword)
    );
  };

  const isPasswordValid = (password: string): boolean => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
    
    return hasLowercase && hasUppercase && hasNumber && hasSpecial;
  };

  const setPulseIdAvailable = (available: boolean | null) => {
    setFormState(prev => ({ ...prev, pulseIdAvailable: available }));
  };

  const setPulseIdSuggestions = (suggestions: string[]) => {
    setFormState(prev => ({ ...prev, pulseIdSuggestions: suggestions }));
  };

  const setIsEmailValid = (valid: boolean | null) => {
    setFormState(prev => ({ ...prev, isEmailValid: valid }));
  };

  const setRegistrationInProgress = (inProgress: boolean) => {
    setFormState(prev => ({ ...prev, registrationInProgress: inProgress }));
  };

  const setLoading = (loading: boolean) => {
    setFormState(prev => ({ ...prev, loading }));
  };

  return {
    formState,
    updateField,
    isFormValid,
    isPasswordValid,
    setPulseIdAvailable,
    setPulseIdSuggestions,
    setIsEmailValid,
    setRegistrationInProgress,
    setLoading
  };
};
