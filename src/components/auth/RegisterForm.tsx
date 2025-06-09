
import React, { useEffect, useRef } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import EmailInput from './EmailInput';
import PulseIdInput from './PulseIdInput';
import FullNameInput from './FullNameInput';
import PasswordInput from './PasswordInput';
import RegistrationSubmitButton from './RegistrationSubmitButton';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';
import { useRegistrationHandler } from '@/hooks/useRegistrationHandler';
import { checkPulseIdAvailability } from '@/services/pulseIdService';
import { toast } from '@/hooks/use-toast';

interface RegisterFormProps {
  prefilledPulseId?: string;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ prefilledPulseId = '', onSwitchToLogin }) => {
  const hasCheckedPrefilled = useRef(false);
  
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

  const { handleRegister } = useRegistrationHandler(
    formState,
    setRegistrationInProgress,
    setLoading,
    setPulseIdAvailable,
    setPulseIdSuggestions,
    onSwitchToLogin
  );

  // Check prefilled PulseID availability only once on mount
  useEffect(() => {
    const checkPrefilledPulseId = async () => {
      if (prefilledPulseId && prefilledPulseId.length >= 3 && !hasCheckedPrefilled.current) {
        hasCheckedPrefilled.current = true;
        try {
          console.log(`RegisterForm: Checking prefilled PulseID ${prefilledPulseId} (one-time check)`);
          const result = await checkPulseIdAvailability(prefilledPulseId);
          console.log(`RegisterForm: Prefilled PulseID ${prefilledPulseId} is ${result.available ? 'available' : 'taken'}`);
          setPulseIdAvailable(result.available);
          setPulseIdSuggestions(result.available ? [] : result.suggestions);
          
          // Show confirmation that the PulseID is ready to claim
          if (result.available) {
            toast({
              title: "PulseID Ready to Claim",
              description: `"${prefilledPulseId}" is available and ready to be registered to your account.`,
            });
          }
        } catch (error) {
          console.error('RegisterForm: Error checking prefilled PulseID:', error);
        }
      }
    };

    checkPrefilledPulseId();
  }, []); // Empty dependency array to run only once

  // Reset the check flag if prefilledPulseId changes
  useEffect(() => {
    if (prefilledPulseId) {
      hasCheckedPrefilled.current = false;
    }
  }, [prefilledPulseId]);

  // Add debugging for form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== REGISTER FORM SUBMIT TRIGGERED ===');
    console.log('Form state:', {
      fullName: formState.fullName,
      email: formState.registerEmail,
      pulseId: formState.pulseId,
      passwordLength: formState.registerPassword.length,
      isFormValid: isFormValid(),
      pulseIdAvailable: formState.pulseIdAvailable,
      registrationInProgress: formState.registrationInProgress
    });
    
    console.log('Submit button should be enabled:', !formState.loading && isFormValid() && !formState.registrationInProgress);
    
    if (!isFormValid()) {
      console.log('=== FORM VALIDATION FAILED - NOT CALLING HANDLER ===');
      toast({
        title: "Form incomplete",
        description: "Please fill out all required fields correctly.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('=== CALLING REGISTRATION HANDLER ===');
    handleRegister(e);
  };

  return (
    <form onSubmit={handleFormSubmit}>
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

        {/* Debug info */}
        <div className="text-xs text-gray-500 p-2 bg-gray-800/20 rounded">
          Form Valid: {isFormValid() ? 'Yes' : 'No'} | 
          Loading: {formState.loading ? 'Yes' : 'No'} | 
          In Progress: {formState.registrationInProgress ? 'Yes' : 'No'}
        </div>
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
