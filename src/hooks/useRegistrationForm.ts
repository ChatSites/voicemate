
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
    console.log(`useRegistrationForm: Updating ${field} to:`, value);
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  const isPasswordValid = useCallback((password: string): boolean => {
    if (password.length < 8) {
      console.log('Password validation failed: too short');
      return false;
    }
    
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
    
    console.log('Password validation:', {
      length: password.length,
      hasLowercase,
      hasUppercase, 
      hasNumber,
      hasSpecial
    });
    
    return hasLowercase && hasUppercase && hasNumber && hasSpecial;
  }, []);

  const isFormValid = useCallback(() => {
    const validFields = 
      formState.fullName.length >= 3 && 
      formState.registerEmail && 
      formState.registerEmail.includes('@') && 
      formState.pulseId.length >= 3 && 
      formState.registerPassword.length >= 8;
    
    const validPassword = isPasswordValid(formState.registerPassword);
    const validAvailability = formState.pulseIdAvailable === true;
    
    console.log('Form validation check:', {
      validFields,
      validPassword,
      validAvailability,
      fullNameLength: formState.fullName.length,
      hasEmail: !!formState.registerEmail,
      emailHasAt: formState.registerEmail.includes('@'),
      pulseIdLength: formState.pulseId.length,
      passwordLength: formState.registerPassword.length,
      pulseIdAvailable: formState.pulseIdAvailable
    });
    
    return validFields && validPassword && validAvailability;
  }, [formState, isPasswordValid]);

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
    console.log(`useRegistrationForm: Setting registrationInProgress to ${inProgress}`);
    setFormState(prev => ({ ...prev, registrationInProgress: inProgress }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    console.log(`useRegistrationForm: Setting loading to ${loading}`);
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
