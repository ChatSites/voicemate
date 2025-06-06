
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

// This is a simplified check, final verification happens during registration
export const finalEmailCheck = async (email: string): Promise<boolean> => {
  // Just do basic format validation
  return email && email.includes('@');
};

// This is a simplified check, final verification happens during registration
export const finalPulseIdCheck = async (id: string): Promise<boolean> => {
  // Just do basic format validation
  return id && id.length >= 3;
};

export const registerUser = async (
  fullName: string,
  email: string,
  pulseId: string,
  password: string
) => {
  console.log('Starting registration process for:', email, 'with PulseID:', pulseId);
  
  try {
    // Clean up existing auth state to avoid conflicts
    cleanupAuthState();
    
    // Prepare user metadata with the claimed PulseID
    const userData = {
      full_name: fullName,
      pulse_id: pulseId, // This will be used by the trigger to populate the users table
    };
    
    console.log('Registering with data:', userData);
    
    // Perform registration with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
      }
    });
    
    if (authError) {
      console.error('Auth registration error:', authError);
      
      // Special handling for "User already registered" - don't show toast here, let the calling component handle it
      if (authError.message.includes("User already registered")) {
        return { 
          success: false, 
          error: new Error("This email was previously used. Please try logging in or use a different email."),
          isEmailAlreadyRegistered: true
        };
      }
      
      return { 
        success: false, 
        error: new Error(authError.message || "Something went wrong during registration")
      };
    }
    
    console.log('Auth registration succeeded:', authData);
    
    // Check if we need email confirmation
    const emailConfirmNeeded = !authData.session;
    
    // The user profile will be automatically created by the database trigger
    // with the PulseID from the user metadata
    if (authData.user) {
      console.log('User registered successfully with PulseID:', pulseId);
      console.log('Profile will be created automatically by database trigger');
    }
    
    // Only show success toast if registration was truly successful
    if (emailConfirmNeeded) {
      console.log('Email confirmation is required for:', email);
    } else {
      console.log('User registered successfully without email confirmation needed');
    }
    
    return { 
      success: true, 
      user: authData.user,
      session: authData.session,
      emailConfirmNeeded,
      pulseId
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
