
import React from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import EmailInput from './EmailInput';
import PulseIdInput from './PulseIdInput';
import FullNameInput from './FullNameInput';
import PasswordInput from './PasswordInput';
import RegistrationSubmitButton from './RegistrationSubmitButton';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';
import { useRegistrationHandler } from '@/hooks/useRegistrationHandler';

interface RegisterFormProps {
  prefilledPulseId?: string;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ prefilledPulseId = '', onSwitchToLogin }) => {
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
