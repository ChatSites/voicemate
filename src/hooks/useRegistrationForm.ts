
import { useState, useEffect, useCallback } from 'react';

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

  // Update pulseId when prefilledPulseId changes (only if different)
  useEffect(() => {
    if (prefilledPulseId && prefilledPulseId !== formState.pulseId) {
      console.log(`useRegistrationForm: Updating PulseID from ${formState.pulseId} to ${prefilledPulseId}`);
      setFormState(prev => ({ ...prev, pulseId: prefilledPulseId }));
    }
  }, [prefilledPulseId, formState.pulseId]);

  const updateField = useCallback((field: keyof RegistrationFormData, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  const isFormValid = useCallback(() => {
    const validFields = 
      formState.fullName.length >= 3 && 
      formState.registerEmail && 
      formState.registerEmail.includes('@') && 
      formState.pulseId.length >= 3 && 
      formState.registerPassword.length >= 8 &&
      isPasswordValid(formState.registerPassword);
    
    const validAvailability = formState.pulseIdAvailable === true;
    
    return validFields && validAvailability;
  }, [formState]);

  const isPasswordValid = useCallback((password: string): boolean => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
    
    return hasLowercase && hasUppercase && hasNumber && hasSpecial;
  }, []);

  const setPulseIdAvailable = useCallback((available: boolean | null) => {
    console.log(`useRegistrationForm: Setting pulseIdAvailable to ${available}`);
    setFormState(prev => ({ ...prev, pulseIdAvailable: available }));
  }, []);

  const setPulseIdSuggestions = useCallback((suggestions: string[]) => {
    setFormState(prev => ({ ...prev, pulseIdSuggestions: suggestions }));
  }, []);

  const setIsEmailValid = useCallback((valid: boolean | null) => {
    setFormState(prev => ({ ...prev, isEmailValid: valid }));
  }, []);

  const setRegistrationInProgress = useCallback((inProgress: boolean) => {
    setFormState(prev => ({ ...prev, registrationInProgress: inProgress }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setFormState(prev => ({ ...prev, loading }));
  }, []);

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
