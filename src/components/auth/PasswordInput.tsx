
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormFeedback from '@/components/ui/form-feedback';

type PasswordInputProps = {
  password: string;
  setPassword: (password: string) => void;
  registrationInProgress: boolean;
}

// Function to check if password meets complexity requirements
const validatePasswordComplexity = (password: string): boolean => {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
  
  return hasLowercase && hasUppercase && hasNumber && hasSpecial;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  setPassword,
  registrationInProgress
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  
  const isComplexEnough = validatePasswordComplexity(password);
  const isLongEnough = password.length >= 8;
  const showComplexityWarning = passwordTouched && password.length > 0 && !isComplexEnough;
  const showLengthWarning = passwordTouched && password.length > 0 && !isLongEnough;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!passwordTouched) {
      setPasswordTouched(true);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const renderPasswordRequirements = () => {
    if (!passwordTouched || password.length === 0) return null;
    
    return (
      <div className="mt-2">
        {showLengthWarning && (
          <FormFeedback
            type="warning"
            message="Password must be at least 8 characters"
          />
        )}
        
        {showComplexityWarning && (
          <div className="space-y-1">
            <FormFeedback
              type="warning"
              message="Password must include at least one of each:"
            />
            <ul className="list-disc list-inside ml-6 text-sm text-amber-400">
              <li className={/[a-z]/.test(password) ? "text-green-500" : ""}>
                Lowercase letter (a-z)
              </li>
              <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>
                Uppercase letter (A-Z)
              </li>
              <li className={/[0-9]/.test(password) ? "text-green-500" : ""}>
                Number (0-9)
              </li>
              <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password) ? "text-green-500" : ""}>
                Special character (!@#$%^&*()_+-=[]{};&apos;:&quot;|\,&lt;&gt;?./`~)
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          className="bg-black/30 border-gray-700 text-white pr-10"
          value={password}
          onChange={handleChange}
          onBlur={() => setPasswordTouched(true)}
          required
          disabled={registrationInProgress}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={toggleShowPassword}
          tabIndex={-1}
          disabled={registrationInProgress}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4 text-gray-400" />
          ) : (
            <EyeIcon className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>
      
      {renderPasswordRequirements()}
    </div>
  );
};

export default PasswordInput;
