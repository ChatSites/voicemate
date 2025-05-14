
import React from 'react';
import { Progress } from '@/components/ui/progress';
import FormFeedback from '@/components/ui/form-feedback';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  // Calculate strength score based on multiple factors
  const calculateStrength = (pwd: string): number => {
    if (!pwd) return 0;
    
    // Start with a base score
    let score = 0;
    const maxScore = 100;
    
    // Length check (up to 30 points)
    const lengthScore = Math.min(30, pwd.length * 3);
    score += lengthScore;
    
    // Character variety (up to 70 points)
    if (/[a-z]/.test(pwd)) score += 15; // lowercase
    if (/[A-Z]/.test(pwd)) score += 15; // uppercase
    if (/[0-9]/.test(pwd)) score += 15; // numbers
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pwd)) score += 25; // special chars
    
    // Penalize repeating patterns
    if (/(.)\1\1/.test(pwd)) score -= 10; // Same character repeated 3+ times
    
    // Ensure score is between 0-100
    return Math.max(0, Math.min(maxScore, score));
  };
  
  const strength = calculateStrength(password);
  
  // Determine color based on strength
  const getStrengthColor = (score: number): string => {
    if (score < 30) return 'bg-red-500';
    if (score < 60) return 'bg-amber-500';
    if (score < 80) return 'bg-yellow-400';
    return 'bg-green-500';
  };
  
  // Get descriptive text based on strength
  const getStrengthLabel = (score: number): string => {
    if (score < 30) return 'Weak';
    if (score < 60) return 'Fair';
    if (score < 80) return 'Good';
    return 'Strong';
  };
  
  const strengthLabel = getStrengthLabel(strength);
  const strengthColor = getStrengthColor(strength);
  
  // Don't show anything if password is empty
  if (password.length === 0) return null;
  
  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-300">Password Strength</span>
        <span className={cn(
          "text-xs font-medium",
          strength < 30 ? "text-red-500" : 
          strength < 60 ? "text-amber-500" : 
          strength < 80 ? "text-yellow-400" : 
          "text-green-500"
        )}>
          {strengthLabel}
        </span>
      </div>
      
      <Progress 
        value={strength} 
        className="h-1.5 bg-gray-700" 
        indicatorClassName={strengthColor}
      />
      
      {strength < 60 && (
        <FormFeedback
          type="warning"
          message="Consider using a stronger password"
          className="mt-1"
        />
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
