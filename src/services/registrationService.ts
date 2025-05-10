
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
    
    // Clean up existing state
    cleanupAuthState();
    
    // Use the debug registration function
    const userData = {
      full_name: fullName,
      username: pulseId,
    };
    
    console.log('Registering with data:', userData);
    
    const result = await debugRegistration(email, password, userData);
    
    if (!result.success) {
      if (result.error?.message?.includes("User already registered")) {
        toast({
          title: "Email already registered",
          description: "This email is already registered. Please try logging in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration failed",
          description: result.error?.message || "Something went wrong during registration",
          variant: "destructive",
        });
      }
      throw result.error || new Error("Registration failed");
    }
    
    console.log('Registration succeeded:', result);
    
    // Manually update the profile with the PulseID to claim it if we have a user
    if (result.user) {
      try {
        console.log('Updating profile for user:', result.user.id);
        const { error: updateError } = await supabase
          .from('profiles')
          .upsert({
            id: result.user.id,
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
    
    if (result.emailConfirmNeeded) {
      // Show a message about email confirmation
      toast({
        title: "Email confirmation required",
        description: "Please check your email and confirm your account before logging in.",
      });
    }
    
    return { success: true, result };
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
