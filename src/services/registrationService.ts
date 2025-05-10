import { supabase, cleanupAuthState, isPulseIdTaken, debugRegistration } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

export const finalEmailCheck = async (email: string): Promise<boolean> => {
  try {
    // Check if email has valid format
    if (!email.includes('@')) {
      return false;
    }

    // Try signing in as if the user exists
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // Don't create user if they don't exist
      }
    });

    // If we get message about email not found or security, email is available
    if (error && (
      error.message.includes('not found') || 
      error.message.includes('security') ||
      error.message.includes('Unable to validate')
    )) {
      console.log('Email verification: Email appears to be available:', email);
      return true; // Email is available
    }
    
    // Otherwise assume email is taken
    console.log('Email verification: Email appears to be taken:', email);
    return false;
  } catch (error) {
    console.error('Error in final email check:', error);
    // On error, allow registration attempt
    return true;
  }
};

export const finalPulseIdCheck = async (id: string): Promise<boolean> => {
  try {
    // Log the check for debugging
    console.log(`Final PulseID check for: ${id}`);
    
    // Simple check for empty IDs
    if (!id || id.trim() === '') {
      return false;
    }
    
    // Always allow registration attempts
    return true;
  } catch (error) {
    console.error('Error in final PulseID check:', error);
    return true; // Allow registration attempts
  }
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
    
    // Prepare user metadata
    const userData = {
      full_name: fullName,
      username: pulseId,
    };
    
    console.log('Registering with data:', userData);
    
    // Try direct registration
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/auth-confirmation?type=signup`,
      }
    });
    
    if (authError) {
      console.error('Auth registration error:', authError);
      
      // Special handling for "User already registered"
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
    
    // Update the profile with the PulseID
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
    }
    
    if (emailConfirmNeeded) {
      toast({
        title: "Email confirmation required",
        description: "Please check your email and confirm your account before logging in.",
      });
      
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
