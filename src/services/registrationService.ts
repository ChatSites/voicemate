
import { supabase, cleanupAuthState, isPulseIdTaken, debugRegistration } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

export const finalEmailCheck = async (email: string): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password: 'password_check_only_' + Math.random().toString(36).substring(2),
    });

    // If we get a session, then this email already exists
    return !data.session;
  } catch (error) {
    console.error('Error in final email check:', error);
    return true; // Assume available on error (allow registration attempt)
  }
};

export const finalPulseIdCheck = async (id: string): Promise<boolean> => {
  try {
    const isTaken = await isPulseIdTaken(id);
    return !isTaken; // Return true if ID is available (not taken)
  } catch (error) {
    console.error('Error in final PulseID check:', error);
    return false; // Assume not available on error (safer)
  }
};

export const registerUser = async (
  fullName: string,
  email: string,
  pulseId: string,
  password: string
) => {
  console.log('Starting registration process for:', email);
  
  try {
    // Final verification: Both email AND PulseID still available?
    const [emailIsAvailable, pulseIdIsAvailable] = await Promise.all([
      finalEmailCheck(email),
      finalPulseIdCheck(pulseId)
    ]);
    
    // Check PulseID availability first 
    if (!pulseIdIsAvailable) {
      console.log('Final check failed - PulseID is now taken');
      toast({
        title: "PulseID was just taken",
        description: "Someone claimed this PulseID while you were registering. Please choose another.",
        variant: "destructive",
      });
      
      // Generate suggestions
      const suggestions = [
        `${pulseId}${Math.floor(Math.random() * 100)}`,
        `${pulseId}_${Math.floor(Math.random() * 100)}`,
        `${pulseId}${Math.floor(Math.random() * 900) + 100}`,
      ];
      
      return { 
        success: false, 
        error: new Error("PulseID was just taken"),
        pulseIdAvailable: false,
        pulseIdSuggestions: suggestions
      };
    }
    
    console.log('PulseID check passed - PulseID is still available');
    
    // Check email availability (in case it was registered between checks)
    if (!emailIsAvailable) {
      console.log('Final check failed - Email is already registered');
      toast({
        title: "Email already registered",
        description: "This email was registered while you were filling out the form. Please try logging in instead.",
        variant: "destructive",
      });
      
      return {
        success: false,
        error: new Error("Email already registered"),
        pulseIdAvailable: true,
        pulseIdSuggestions: []
      };
    }
    
    // Clean up existing state
    cleanupAuthState();
    
    // Prepare user metadata
    const userData = {
      full_name: fullName,
      username: pulseId,
    };
    
    console.log('Registering with data:', userData);
    
    // Try sign up first - if it fails with "User already registered", try alternative approach
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/auth?tab=login`,
      }
    });
    
    if (authError) {
      console.error('Auth registration error:', authError);
      
      // Special handling for "User already registered" - likely a deleted user that still has records
      if (authError.message.includes("User already registered")) {
        toast({
          title: "Email previously registered",
          description: "This email was previously used. Please try logging in or use a different email.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration failed",
          description: authError.message || "Something went wrong during registration",
          variant: "destructive",
        });
      }
      
      throw authError;
    }
    
    console.log('Auth registration succeeded:', authData);
    
    // Check if we need email confirmation
    const emailConfirmNeeded = !authData.session;
    
    // Manually update the profile with the PulseID to claim it if we have a user
    if (authData.user) {
      try {
        console.log('Updating profile for user:', authData.user.id);
        const { error: updateError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
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
    } else {
      console.warn('No user object returned from registration - cannot update profile');
    }
    
    if (emailConfirmNeeded) {
      // Show a message about email confirmation
      toast({
        title: "Email confirmation required",
        description: "Please check your email and confirm your account before logging in.",
      });
      
      // Log that email confirmation is needed
      console.log('Email confirmation is required for:', email);
    } else {
      toast({
        title: "Registration successful",
        description: "Your account has been created. Welcome to VoiceMate!",
      });
      
      console.log('User registered successfully without email confirmation needed');
    }
    
    return { 
      success: true, 
      user: authData.user,
      session: authData.session,
      emailConfirmNeeded
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      error,
      pulseIdAvailable: true,
      pulseIdSuggestions: []
    };
  }
};
