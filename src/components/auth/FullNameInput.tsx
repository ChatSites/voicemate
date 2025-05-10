
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
  return (
    <div className="space-y-2">
      <Label htmlFor="fullname">Full Name</Label>
      <Input 
        id="fullname" 
        type="text" 
        placeholder="John Doe" 
        className="bg-black/30 border-gray-700"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        disabled={registrationInProgress}
      />
    </div>
  );
};

export default FullNameInput;
