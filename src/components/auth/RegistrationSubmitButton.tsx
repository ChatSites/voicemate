
import React from 'react';
import { Button } from '@/components/ui/button';

type RegistrationSubmitButtonProps = {
  isLoading: boolean;
  isFormValid: boolean;
  isRegistrationInProgress: boolean;
};

const RegistrationSubmitButton: React.FC<RegistrationSubmitButtonProps> = ({
  isLoading,
  isFormValid,
  isRegistrationInProgress
}) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-voicemate-red hover:bg-red-600"
      disabled={isLoading || !isFormValid || isRegistrationInProgress}
    >
      {isLoading ? "Creating account..." : "Claim Your PulseID"}
    </Button>
  );
};

export default RegistrationSubmitButton;
