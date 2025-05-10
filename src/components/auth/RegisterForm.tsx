
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { supabase, cleanupAuthState, isEmailRegistered, isPulseIdTaken } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import PulseIdChecker from './PulseIdChecker';

const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [pulseId, setPulseId] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [pulseIdAvailable, setPulseIdAvailable] = useState<boolean | null>(null);
  const [pulseIdSuggestions, setPulseIdSuggestions] = useState<string[]>([]);
  const [isCheckingPulseId, setIsCheckingPulseId] = useState(false);
  const [registrationInProgress, setRegistrationInProgress] = useState(false);
  const [lastCheckedPulseId, setLastCheckedPulseId] = useState('');
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // Email validation (check if already registered)
  useEffect(() => {
    if (registrationInProgress || !registerEmail) {
      return;
    }

    // Validate email format first
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      setIsEmailValid(null);
      return;
    }

    const checkEmailAvailability = async () => {
      setIsCheckingEmail(true);
      try {
        const isRegistered = await isEmailRegistered(registerEmail);
        setIsEmailValid(!isRegistered);
      } catch (error) {
        console.error('Error checking email availability:', error);
        setIsEmailValid(null);
      } finally {
        setIsCheckingEmail(false);
      }
    };

    const timerId = setTimeout(checkEmailAvailability, 600);
    return () => clearTimeout(timerId);
  }, [registerEmail, registrationInProgress]);

  // PulseID verification
  useEffect(() => {
    // Skip checking if registration is in progress to avoid UI confusion
    if (registrationInProgress) return;

    const checkPulseId = async () => {
      if (!pulseId || pulseId.length < 3) {
        setPulseIdAvailable(null);
        setPulseIdSuggestions([]);
        return;
      }

      setIsCheckingPulseId(true);
      
      try {
        console.log(`Checking availability for PulseID: ${pulseId}`);
        
        const isTaken = await isPulseIdTaken(pulseId);
        const isAvailable = !isTaken;
        
        console.log(`PulseID ${pulseId} is ${isAvailable ? 'available' : 'taken'}`);
        
        setLastCheckedPulseId(pulseId);
        setPulseIdAvailable(isAvailable);
        
        // Generate suggestions if not available
        if (!isAvailable) {
          const suggestions = [
            `${pulseId}${Math.floor(Math.random() * 100)}`,
            `${pulseId}_${Math.floor(Math.random() * 100)}`,
            `${pulseId}${Math.floor(Math.random() * 900) + 100}`,
          ];
          setPulseIdSuggestions(suggestions);
        } else {
          setPulseIdSuggestions([]);
        }
      } catch (error) {
        console.error('Error checking PulseID:', error);
        setPulseIdAvailable(null);
      } finally {
        setIsCheckingPulseId(false);
      }
    };
    
    // Debounce the check to avoid too many requests
    const timerId = setTimeout(checkPulseId, 500);
    return () => clearTimeout(timerId);
  }, [pulseId, registrationInProgress]);

  const finalEmailCheck = async (email: string): Promise<boolean> => {
    try {
      const isRegistered = await isEmailRegistered(email);
      return !isRegistered; // Return true if email is available (not registered)
    } catch (error) {
      console.error('Error in final email check:', error);
      return false; // Assume not available on error (safer)
    }
  };

  const finalPulseIdCheck = async (id: string): Promise<boolean> => {
    try {
      const isTaken = await isPulseIdTaken(id);
      return !isTaken; // Return true if ID is available (not taken)
    } catch (error) {
      console.error('Error in final PulseID check:', error);
      return false; // Assume not available on error (safer)
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submission attempts
    if (registrationInProgress) {
      return;
    }
    
    // Basic input validation
    if (!pulseId || pulseId.length < 3) {
      toast({
        title: "Invalid PulseID",
        description: "PulseID must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }
    
    if (!fullName || !registerEmail || !registerPassword) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if email validation previously failed
    if (isEmailValid === false) {
      toast({
        title: "Email already registered",
        description: "Please use a different email or try logging in instead",
        variant: "destructive",
      });
      return;
    }
    
    // Mark registration as in-progress to prevent further checks
    setRegistrationInProgress(true);
    setLoading(true);
    
    try {
      // Final verification: Both email AND PulseID still available?
      const [emailIsAvailable, pulseIdIsAvailable] = await Promise.all([
        finalEmailCheck(registerEmail),
        finalPulseIdCheck(pulseId)
      ]);
      
      // Check email availability first
      if (!emailIsAvailable) {
        toast({
          title: "Email already registered",
          description: "This email address is already in use. Please use a different email or try to log in.",
          variant: "destructive",
        });
        setIsEmailValid(false);
        throw new Error("Email already registered");
      }
      
      console.log('Email check passed - Email is still available');
      
      // Then check PulseID availability 
      if (!pulseIdIsAvailable) {
        console.log('Final check failed - PulseID is now taken');
        // PulseID is taken, update state and notify user
        setPulseIdAvailable(false);
        
        // Generate suggestions
        const suggestions = [
          `${pulseId}${Math.floor(Math.random() * 100)}`,
          `${pulseId}_${Math.floor(Math.random() * 100)}`,
          `${pulseId}${Math.floor(Math.random() * 900) + 100}`,
        ];
        setPulseIdSuggestions(suggestions);
        
        toast({
          title: "PulseID was just taken",
          description: "Someone claimed this PulseID while you were registering. Please choose another or select one of our suggestions.",
          variant: "destructive",
        });
        
        throw new Error("PulseID was just taken");
      }
      
      console.log('Final checks passed - Both email and PulseID are still available');
      
      // Clean up existing state
      cleanupAuthState();
      
      // Now we're ready to create the user account
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            full_name: fullName,
            username: pulseId,
          },
        },
      });
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes("User already registered")) {
          setIsEmailValid(false);
          toast({
            title: "Email already registered",
            description: "This email is already registered. Please try logging in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration failed",
            description: error.message || "Something went wrong during registration",
            variant: "destructive",
          });
        }
        throw error;
      }
      
      // Manually update the profile with the PulseID to claim it
      if (data.user) {
        try {
          console.log('Updating profile for user:', data.user.id);
          const { error: updateError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              username: pulseId,
            });
            
          if (updateError) {
            console.error('Failed to update profile:', updateError);
          } else {
            console.log('Successfully updated profile with username:', pulseId);
          }
        } catch (profileError) {
          console.error('Failed to update profile:', profileError);
        }
      }
      
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account",
      });
      
      // Attempt to navigate to login tab
      document.querySelector('[data-state="inactive"][data-value="login"]')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Don't show duplicate error messages
      if (!error.message.includes("Email already registered") && 
          !error.message.includes("PulseID was just taken")) {
        toast({
          title: "Registration failed",
          description: error?.message || "Please check your information and try again",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setRegistrationInProgress(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setPulseId(suggestion);
    // Set as available since we generated this suggestion
    setPulseIdAvailable(true);
    setLastCheckedPulseId(suggestion);
    setPulseIdSuggestions([]);
  };

  return (
    <form onSubmit={handleRegister}>
      <CardContent className="space-y-4">
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="regemail">Email</Label>
          <div className="relative">
            <Input 
              id="regemail" 
              type="email" 
              placeholder="hello@example.com" 
              className={`bg-black/30 border-gray-700 ${
                isEmailValid === false ? "border-red-500" : 
                isEmailValid === true ? "border-green-500" : ""
              }`}
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              disabled={registrationInProgress}
            />
            {isCheckingEmail && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 border-2 border-t-transparent border-voicemate-purple rounded-full animate-spin"></div>
              </div>
            )}
            {!isCheckingEmail && isEmailValid !== null && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isEmailValid ? (
                  <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                ) : (
                  <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                )}
              </div>
            )}
          </div>
          {isEmailValid === false && (
            <p className="text-sm text-red-400">This email is already registered. Please log in instead.</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="pulse-id">Desired PulseID</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm bg-black/50 rounded-l-md border border-r-0 border-gray-700 text-gray-400">
              pulse/
            </span>
            <div className="relative flex-1">
              <Input 
                id="pulse-id" 
                placeholder="yourname" 
                className="rounded-l-none bg-black/30 border-gray-700"
                value={pulseId}
                onChange={(e) => setPulseId(e.target.value)}
                required
                disabled={registrationInProgress}
              />
              {isCheckingPulseId && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 border-2 border-t-transparent border-voicemate-purple rounded-full animate-spin"></div>
                </div>
              )}
              {!isCheckingPulseId && pulseIdAvailable !== null && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {pulseIdAvailable ? (
                    <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                  ) : (
                    <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <PulseIdChecker 
            pulseIdAvailable={pulseIdAvailable as boolean}
            pulseIdSuggestions={pulseIdSuggestions}
            onSelectSuggestion={selectSuggestion}
            registrationInProgress={registrationInProgress}
          />
          
          {pulseId.length > 0 && pulseId.length < 3 && (
            <p className="text-sm text-amber-400">PulseID must be at least 3 characters</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="regpassword">Password</Label>
          <Input 
            id="regpassword" 
            type="password" 
            className="bg-black/30 border-gray-700"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-voicemate-red hover:bg-red-600"
          disabled={loading || 
                   pulseIdAvailable === false || 
                   pulseId.length < 3 || 
                   isCheckingPulseId || 
                   registrationInProgress || 
                   isEmailValid === false ||
                   isCheckingEmail}
        >
          {loading ? "Creating account..." : "Claim Your PulseID"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default RegisterForm;
