
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = {
  password: string;
  setPassword: (password: string) => void;
  registrationInProgress: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  setPassword,
  registrationInProgress
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="regpassword">Password</Label>
      <div className="relative">
        <Input 
          id="regpassword" 
          type={showPassword ? "text" : "password"}
          className="bg-black/30 border-gray-700 pr-10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={registrationInProgress}
        />
        <button 
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
