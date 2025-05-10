
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="fullname">Full Name</Label>
      <Input 
        id="fullname" 
        type="text" 
        placeholder="John Doe" 
        className={`bg-black/30 border-gray-700 ${
          fullName.length > 0 && fullName.length < 3 ? "border-amber-500" : ""
        }`}
        value={fullName}
        onChange={handleNameChange}
        required
        disabled={registrationInProgress}
      />
      {fullName.length > 0 && fullName.length < 3 && (
        <p className="text-sm text-amber-400">Name should be at least 3 characters</p>
      )}
    </div>
  );
};

export default FullNameInput;
