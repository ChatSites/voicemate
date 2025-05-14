
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormFeedback from '@/components/ui/form-feedback';

type FullNameInputProps = {
  fullName: string;
  setFullName: (name: string) => void;
  registrationInProgress: boolean;
}

const FullNameInput: React.FC<FullNameInputProps> = ({
  fullName,
  setFullName,
  registrationInProgress
}) => {
  const [isTouched, setIsTouched] = useState(false);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    if (!isTouched) setIsTouched(true);
  };
  
  const showError = isTouched && fullName.length > 0 && fullName.length < 3;

  return (
    <div className="space-y-2">
      <Label htmlFor="fullname">Full Name</Label>
      <Input 
        id="fullname" 
        type="text" 
        placeholder="John Doe" 
        className={`bg-black/30 border-gray-700 text-white ${
          showError ? "border-amber-500" : ""
        }`}
        value={fullName}
        onChange={handleNameChange}
        onBlur={() => setIsTouched(true)}
        required
        disabled={registrationInProgress}
      />
      {showError && (
        <FormFeedback 
          type="warning"
          message="Name should be at least 3 characters"
        />
      )}
    </div>
  );
};

export default FullNameInput;
