
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';

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
    
    // Check if email confirmation is required by attempting registration without redirect first
    console.log('Attempting registration...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        // Don't set emailRedirectTo to avoid email confirmation requirement for now
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
    
    // Check if we have a session (no email confirmation needed) or just a user (email confirmation needed)
    const emailConfirmNeeded = !authData.session;
    console.log('Email confirmation needed:', emailConfirmNeeded);
    
    if (authData.user) {
      console.log('User registered successfully with ID:', authData.user.id);
      console.log('User metadata:', authData.user.user_metadata);
      
      // If we have a session, try to create the profile immediately
      if (authData.session) {
        console.log('User has session, creating profile directly...');
        
        // Create the user profile directly since we have an active session
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
          console.error('Failed to create user profile:', insertError);
          // Don't fail registration, profile can be created later
        } else {
          console.log('User profile created successfully:', insertedProfile);
        }
      } else {
        console.log('No session yet, profile will be created after email confirmation');
      }
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
