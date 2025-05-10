
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

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
  const [passwordStrength, setPasswordStrength] = useState<{
    valid: boolean;
    message: string;
  }>({ valid: false, message: "" });
  
  useEffect(() => {
    // Check password strength
    if (!password) {
      setPasswordStrength({ valid: false, message: "" });
      return;
    }
    
    if (password.length < 8) {
      setPasswordStrength({ 
        valid: false, 
        message: "Password must be at least 8 characters" 
      });
      return;
    }
    
    // Valid password
    setPasswordStrength({ 
      valid: true, 
      message: "Password strength: Good" 
    });
  }, [password]);
  
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
          className={`bg-black/30 border-gray-700 pr-10 ${
            password && (passwordStrength.valid ? "border-green-500" : "border-amber-500")
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={registrationInProgress}
          minLength={8}
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
      
      {password && passwordStrength.message && (
        <div className="flex items-center text-sm gap-1">
          {passwordStrength.valid ? (
            <CheckCircle2 className="h-3 w-3 text-green-500" />
          ) : (
            <XCircle className="h-3 w-3 text-amber-500" />
          )}
          <span className={passwordStrength.valid ? "text-green-500" : "text-amber-500"}>
            {passwordStrength.message}
          </span>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
