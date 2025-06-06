
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
  console.log('=== REGISTRATION PROCESS START ===');
  console.log('Registration attempt:', { fullName, email, pulseId, passwordLength: password.length });
  
  try {
    // Clean up any existing auth state first
    console.log('Cleaning up existing auth state...');
    cleanupAuthState();
    
    // Try to sign out any existing sessions
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.log('No existing session to sign out');
    }

    // Check if PulseID is available before proceeding
    console.log('Checking PulseID availability...');
    const { data: existingPulseId, error: pulseIdError } = await supabase
      .from('users')
      .select('id, pulse_id, name')
      .or(`pulse_id.ilike.${pulseId},name.ilike.${pulseId}`)
      .limit(1);

    if (pulseIdError) {
      console.error('Error checking PulseID:', pulseIdError);
    }

    if (existingPulseId && existingPulseId.length > 0) {
      console.log(`PulseID ${pulseId} is already taken`);
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

    // Attempt registration with Supabase Auth
    console.log('Calling Supabase auth.signUp...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          pulse_id: pulseId,
        }
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
        error: new Error(authError.message || "Registration failed")
      };
    }

    console.log('Auth registration successful:', {
      userId: authData.user?.id,
      hasSession: !!authData.session,
      emailConfirmed: authData.user?.email_confirmed_at ? 'YES' : 'NO'
    });

    // If we got a session immediately, user is logged in
    if (authData.session) {
      console.log('User logged in immediately, creating profile manually...');
      
      // Create profile manually since we have a session
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user!.id,
          name: fullName,
          pulse_id: pulseId,
          email: email
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation failed:', profileError);
        // Continue anyway - the user is still registered
      } else {
        console.log('Profile created successfully:', profile);
      }

      return {
        success: true,
        user: authData.user,
        session: authData.session,
        emailConfirmNeeded: false
      };
    } else {
      console.log('Email confirmation required');
      return {
        success: true,
        user: authData.user,
        session: null,
        emailConfirmNeeded: true
      };
    }

  } catch (error: any) {
    console.error('=== REGISTRATION PROCESS ERROR ===', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(error?.message || 'Unknown registration error')
    };
  }
};
