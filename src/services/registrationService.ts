
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
): Promise<{
  success: boolean;
  error?: Error;
  pulseIdAvailable?: boolean;
  pulseIdSuggestions?: string[];
  user?: any;
  session?: any;
  emailConfirmNeeded?: boolean;
}> => {
  console.log('=== REGISTRATION DEBUG START ===');
  console.log('Registration data:', { fullName, email, pulseId, passwordLength: password.length });
  
  try {
    // Clean up existing auth state to avoid conflicts
    cleanupAuthState();
    
    // First check if PulseID is available
    console.log('Checking PulseID availability before registration...');
    const { data: existingPulseId, error: pulseIdError } = await supabase
      .from('users')
      .select('id, pulse_id, name')
      .or(`pulse_id.ilike.${pulseId},name.ilike.${pulseId}`)
      .limit(1);

    if (pulseIdError) {
      console.error('Error checking PulseID:', pulseIdError);
    }

    if (existingPulseId && existingPulseId.length > 0) {
      console.log(`PulseID ${pulseId} is already taken:`, existingPulseId);
      const pulseIdSuggestions = [
        `${pulseId}_${Math.floor(Math.random() * 1000)}`,
        `${pulseId}.${Date.now().toString().slice(-4)}`,
        `${pulseId}123`,
      ];

      return {
        success: false,
        pulseIdAvailable: false,
        pulseIdSuggestions,
        error: new Error('PulseID is already taken'),
      };
    }
    
    // Prepare user metadata with the claimed PulseID
    const userData = {
      full_name: fullName,
      pulse_id: pulseId,
    };
    
    console.log('Calling Supabase auth.signUp with data:', userData);
    
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
      
      if (authError.message.includes("User already registered")) {
        return { 
          success: false, 
          error: new Error("This email was previously used. Please try logging in or use a different email."),
        };
      }
      
      return { 
        success: false, 
        error: new Error(authError.message || "Something went wrong during registration")
      };
    }
    
    console.log('Auth registration response:', authData);
    
    // Check if we need email confirmation
    const emailConfirmNeeded = !authData.session;
    console.log('Email confirmation needed:', emailConfirmNeeded);
    
    if (authData.user) {
      console.log('User registered successfully with ID:', authData.user.id);
      console.log('User metadata:', authData.user.user_metadata);
      
      // Wait longer for the trigger to potentially create the profile
      console.log('Waiting 3 seconds for database trigger...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if user profile was created by trigger
      console.log('Checking if profile was created by trigger...');
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError || !userProfile) {
        console.log('Trigger did not create profile, error:', profileError);
        console.log('Creating profile manually...');
        
        // Create the user profile manually as fallback
        const { data: insertedProfile, error: insertError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: fullName,
            pulse_id: pulseId,
            email: email
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Failed to create user profile manually:', insertError);
          return {
            success: false,
            error: new Error(`Registration succeeded but failed to create profile: ${insertError.message}`)
          };
        } else {
          console.log('User profile created manually successfully:', insertedProfile);
        }
      } else {
        console.log('User profile created by trigger:', userProfile);
      }
      
      // Verify the profile was created
      console.log('Verifying profile creation...');
      const { data: finalProfile, error: verifyError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (verifyError || !finalProfile) {
        console.error('Profile verification failed:', verifyError);
        return {
          success: false,
          error: new Error('Registration succeeded but profile creation failed')
        };
      }
      
      console.log('Final profile verification successful:', finalProfile);
    }
    
    console.log('=== REGISTRATION DEBUG END ===');
    
    return { 
      success: true, 
      user: authData.user,
      session: authData.session,
      emailConfirmNeeded
    };
  } catch (error: any) {
    console.error('=== REGISTRATION ERROR ===', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(error?.message || 'Unknown registration error')
    };
  }
};
