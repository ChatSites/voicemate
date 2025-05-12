
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

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
    
    // Prepare user metadata
    const userData = {
      full_name: fullName,
      username: pulseId,
    };
    
    console.log('Registering with data:', userData);
    
    // Perform registration
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
    
    // Update the user table with the PulseID
    if (authData.user) {
      try {
        console.log('Updating profile for user:', authData.user.id);
        const { error: updateError } = await supabase
          .from('users')
          .upsert({
            id: authData.user.id,
            name: fullName,
            pulse_id: pulseId,
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
